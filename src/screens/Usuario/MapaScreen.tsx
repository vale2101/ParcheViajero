import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import ServiciosMap, { type ServiciosMapHandle } from '../../components/ServiciosMap';
import MapFilters, { type MapFiltersValue } from '../../components/MapFilters';
import ServicioReviewModal from '../../components/ServicioReviewModal';
import ServicioResenaModal from '../../components/ServicioResenaModal';
import LocateButton from '../../components/LocateButton';
import { useUserLocation, type UserLocation } from '../../hooks/useUserLocation';
import { useMapaData } from '../../hooks/useMapaData';
import { calcularDestacadoId } from '../../utils/calcularDestacadoId';
import { filtrarServicios } from '../../utils/filtrarServicios';
import type { Servicio } from '../../api/servicio';
import { getMunicipioCoords } from '../../utils/municipioCoords';
import { styles } from '../../styles/UsuarioMapa.styles';

const ZOOM_MUNICIPIO = 13;
const ZOOM_UBICACION = 15;

export default function MapaScreen() {
  const { servicios, categorias, municipios, resenas } = useMapaData();

  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
  const [resenando, setResenando] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState<UserLocation | null>(null);
  const [filtros, setFiltros] = useState<MapFiltersValue>({
    categoriaId: null,
    municipioId: null,
    query: '',
  });

  const mapRef = useRef<ServiciosMapHandle>(null);
  const { obtenerUbicacion, loading: cargandoUbicacion } = useUserLocation();

  const serviciosFiltrados = useMemo(
    () => filtrarServicios(servicios, filtros),
    [servicios, filtros],
  );


  const destacadoId = useMemo(() => calcularDestacadoId(resenas), [resenas]);

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
      <ServicioResenaModal
        visible={!!seleccionado && !resenando}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
        onDejarResena={() => setResenando(true)}
      />

      <ServicioReviewModal
        visible={resenando}
        servicio={seleccionado}
        onClose={() => setResenando(false)}
      />
    </View>
  );
}