import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EntradaPantalla from '../../components/EntradaPantalla';
import FondoEscena from '../../components/FondoEscena';
import ScreenHeader from '../../components/ScreenHeader';
import ServiciosMap, { type ServiciosMapHandle } from '../../components/ServiciosMap';
import MapFilters, { type MapFiltersValue } from '../../components/MapFilters';
import ServicioReviewModal from '../../components/ServicioReviewModal';
import ServicioResenaModal from '../../components/ServicioResenaModal';
import LocateButton from '../../components/LocateButton';
import PerfilDrawer from '../../components/PerfilDrawer';
import InfoModal from '../../components/InfoModal';
import { useUserLocation, type UserLocation } from '../../hooks/useUserLocation';
import { useMapaData } from '../../hooks/useMapaData';
import { calcularDestacadoId } from '../../utils/calcularDestacadoId';
import { filtrarServicios } from '../../utils/filtrarServicios';
import type { Servicio } from '../../api/servicio';
import { getMunicipioCoords } from '../../utils/municipioCoords';
import { styles } from '../../styles/UsuarioMapa.styles';
import { useAuth } from '../../context/AuthContext';

const ZOOM_MUNICIPIO = 13;
const ZOOM_UBICACION = 15;

interface Info {
  titulo: string;
  texto: string;
}

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const { user, isGuest, logout } = useAuth();
  const { servicios, categorias, municipios, resenas } = useMapaData();
  const { categoriaId: categoriaParam } = useLocalSearchParams<{ categoriaId?: string | string[] }>();

  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
  const [resenando, setResenando] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      const id = Array.isArray(categoriaParam) ? categoriaParam[0] : categoriaParam;
      if (id) {
        setFiltros((prev) => ({ ...prev, categoriaId: id }));
      }
    }, [categoriaParam]),
  );

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

  function handleAcerca() {
    setInfo({
      titulo: 'Acerca de la app',
      texto:
        'Parche Viajero te ayuda a descubrir restaurantes, hoteles y lugares turísticos de Caldas, y a conocer lo que opinan otros viajeros.',
    });
  }

  function handleTerminos() {
    setInfo({
      titulo: 'Términos y condiciones',
      texto:
        'Al usar Parche Viajero aceptas que tus reseñas sean públicas y que debes escribirlas con respeto. Esta app es un proyecto universitario.',
    });
  }

  return (
    <FondoEscena>
    <View style={styles.screen}>
      <EntradaPantalla>
      <ScreenHeader
        onPressMenu={isGuest ? () => setMenuVisible(true) : undefined}
      />

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
        categorias={categorias}
        municipios={municipios}
        mostrarAccionResena={!isGuest}
        onClose={() => setSeleccionado(null)}
        onDejarResena={() => {
          if (user && !isGuest) setResenando(true);
        }}
      />

      <ServicioReviewModal
        visible={resenando}
        servicio={seleccionado}
        categoria={categorias.find((c) => c._id === seleccionado?.categoria_id)?.nombre}
        puedeEnviar={!isGuest}
        onClose={() => setResenando(false)}
      />
      </EntradaPantalla>

      {isGuest && (
        <>
          <PerfilDrawer
            visible={menuVisible}
            onClose={() => setMenuVisible(false)}
            onAcerca={handleAcerca}
            onTerminos={handleTerminos}
            onCerrarSesion={logout}
          />

          <InfoModal
            visible={!!info}
            titulo={info?.titulo ?? ''}
            texto={info?.texto ?? ''}
            onClose={() => setInfo(null)}
          />
        </>
      )}
    </View>
    </FondoEscena>
  );
}