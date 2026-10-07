import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';
import ServiciosMap, { type ServiciosMapHandle } from '../../src/components/ServiciosMap';
import MapFilters, { type MapFiltersValue } from '../../src/components/MapFilters';
import ServicioReviewModal from '../../src/components/ServicioReviewModal';
import LocateButton from '../../src/components/LocateButton';
import { useUserLocation, type UserLocation } from '../../src/hooks/useUserLocation';
import { getServicios, type Servicio } from '../../src/api/servicio';
import { getCategorias, type Categoria } from '../../src/api/categoria';
import { getMunicipios, type Municipio } from '../../src/api/municipio';
import { getResenas, type Resena } from '../../src/api/resena';
import { getMunicipioCoords } from '../../src/utils/municipioCoords';
import { styles } from '../../src/styles/UsuarioMapa.styles';

const MINIMO_RESENAS_PARA_DESTACAR = 3;
const ZOOM_MUNICIPIO = 13;
const ZOOM_UBICACION = 15;

export default function Mapa() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<UserLocation | null>(null);
  const [filtros, setFiltros] = useState<MapFiltersValue>({
    categoriaId: null,
    municipioId: null,
    query: '',
  });

  const mapRef = useRef<ServiciosMapHandle>(null);
  const { obtenerUbicacion, loading: cargandoUbicacion } = useUserLocation();

  const cargarDatos = useCallback(async () => {
    try {
      const [serviciosRes, categoriasRes, municipiosRes, resenasRes] = await Promise.all([
        getServicios(),
        getCategorias(),
        getMunicipios(),
        getResenas(),
      ]);
      setServicios(serviciosRes.data);
      setCategorias(categoriasRes.data);
      setMunicipios(municipiosRes.data);
      setResenas(resenasRes.data);
    } catch {
      // se puede mostrar un toast/error aquí si se quiere
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const serviciosFiltrados = useMemo(() => {
    const query = filtros.query.trim().toLowerCase();

    return servicios.filter((s) => {
      if (filtros.categoriaId && s.categoria_id !== filtros.categoriaId) return false;
      if (filtros.municipioId && s.municipio_id !== filtros.municipioId) return false;
      if (query && !s.nombre.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [servicios, filtros]);

  // Servicio con mejor calificación promedio (con al menos N reseñas),
  // para destacarlo con el pin dorado (⭐) en el mapa
  const destacadoId = useMemo(() => {
    const acumulado: Record<string, { suma: number; cantidad: number }> = {};

    resenas.forEach((r) => {
      const actual = acumulado[r.servicio_id] ?? { suma: 0, cantidad: 0 };
      actual.suma += r.calificacion;
      actual.cantidad += 1;
      acumulado[r.servicio_id] = actual;
    });

    let mejorId: string | null = null;
    let mejorPromedio = 0;

    Object.entries(acumulado).forEach(([servicioId, { suma, cantidad }]) => {
      if (cantidad < MINIMO_RESENAS_PARA_DESTACAR) return;
      const promedio = suma / cantidad;
      if (promedio > mejorPromedio) {
        mejorPromedio = promedio;
        mejorId = servicioId;
      }
    });

    return mejorId;
  }, [resenas]);

  // Al elegir un municipio en los filtros, el mapa se recentra automáticamente
  // en ese municipio (Manizales -> Manizales, Neira -> Neira, etc.)
  useEffect(() => {
    if (!filtros.municipioId) return;

    const municipio = municipios.find((m) => m._id === filtros.municipioId);
    const coords = getMunicipioCoords(municipio?.nombre);

    if (coords) {
      mapRef.current?.centerOn(coords.lat, coords.lng, ZOOM_MUNICIPIO);
    }
  }, [filtros.municipioId, municipios]);

  async function handleLocate() {
    const ubicacion = await obtenerUbicacion();
    if (ubicacion) {
      setUbicacionUsuario(ubicacion);
      mapRef.current?.centerOn(ubicacion.lat, ubicacion.lng, ZOOM_UBICACION);
    }
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <View style={styles.mapWrapper}>
        <ServiciosMap
          ref={mapRef}
          servicios={serviciosFiltrados}
          categorias={categorias}
          destacadoId={destacadoId}
          ubicacionUsuario={ubicacionUsuario}
          onSelectServicio={setSeleccionado}
        />

        <MapFilters
          value={filtros}
          onChange={setFiltros}
          categorias={categorias}
          municipios={municipios}
        />

        <LocateButton onPress={handleLocate} loading={cargandoUbicacion} />
      </View>

      <ServicioReviewModal
        visible={!!seleccionado}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
      />
    </View>
  );
}
