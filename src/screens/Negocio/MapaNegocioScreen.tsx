import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import Loader from '../../components/Loader';
import ServiciosMap from '../../components/ServiciosMap';

import {
  getServiciosByUsuarioId_get,
  type Servicio,
} from '../../api/servicio';

import { getCategorias, type Categoria } from '../../api/categoria';
import { logError, mensajeErrorUsuario } from '../../utils/errorApp';
import styles from '../../styles/MapaNegocio.styles';

function tieneCoordenadasValidas(s: Servicio): boolean {
  const { latitud, longitud } = s;

  return (
    typeof latitud === 'number' &&
    typeof longitud === 'number' &&
    Number.isFinite(latitud) &&
    Number.isFinite(longitud) &&
    Math.abs(latitud) <= 90 &&
    Math.abs(longitud) <= 180 &&
    !(latitud === 0 && longitud === 0)
  );
}

export default function MapaNegocioScreen() {
  const router = useRouter();

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  const peticionRef = useRef(0);

  const cargar = useCallback(async () => {
    const id = ++peticionRef.current;

    setCargando(true);
    setError(null);

    try {
      const [serviciosRes, categoriasRes] = await Promise.all([
        getServiciosByUsuarioId_get(),
        getCategorias().catch(() => ({
          data: [] as Categoria[],
        })),
      ]);

      if (id !== peticionRef.current) return;

      setServicios(serviciosRes.data);
      setCategorias(categoriasRes.data);
      setCargado(true);
    } catch (err) {
      if (id !== peticionRef.current) return;

      logError('No se pudieron cargar tus servicios en el mapa', err);
      setError(mensajeErrorUsuario(err, 'No hemos podido obtener los datos'));
    } finally {
      if (id === peticionRef.current) {
        setCargando(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSeleccionado(null);
      cargar();

      return () => {
        peticionRef.current += 1;
      };
    }, [cargar]),
  );

  const serviciosAprobados = useMemo(
    () => servicios.filter((s) => s.estado_aprobacion === 'aprobado'),
    [servicios],
  );

  const serviciosVisibles = useMemo(
    () => serviciosAprobados.filter(tieneCoordenadasValidas),
    [serviciosAprobados],
  );

  const sinUbicacion = serviciosAprobados.length - serviciosVisibles.length;

  const vacio =
    cargado &&
    !cargando &&
    !error &&
    serviciosVisibles.length === 0;

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <View style={styles.mapWrapper}>
        <ServiciosMap
          servicios={serviciosVisibles}
          categorias={categorias}
          onSelectServicio={setSeleccionado}
          ajustarVista
        />

        {cargando && (
          <View style={styles.loadingBadge} pointerEvents="none">
            <Loader tipo="compacto" texto="Cargando tus lugares…" />
          </View>
        )}

        {!!error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable onPress={cargar} hitSlop={8}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {!error && !cargando && sinUbicacion > 0 && (
          <View style={styles.warningBanner} pointerEvents="none">
            <Text style={styles.warningText}>
              {sinUbicacion === 1
                ? '1 servicio no tiene una ubicación válida y no se muestra'
                : `${sinUbicacion} servicios no tienen una ubicación válida y no se muestran`}
            </Text>
          </View>
        )}

        {vacio && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Aún no tienes lugares en el mapa
            </Text>

            <Text style={styles.emptyText}>
              Tus servicios aparecerán aquí cuando un administrador los apruebe.
            </Text>

          </View>
        )}

        {!!seleccionado && (
          <Pressable
            style={styles.infoCard}
            onPress={() => setSeleccionado(null)}
          >
            <Text style={styles.infoTitle}>
              {seleccionado.nombre}
            </Text>

            {!!seleccionado.direccion && (
              <Text style={styles.infoText}>
                📍 {seleccionado.direccion}
              </Text>
            )}

            {!!seleccionado.horario_atencion && (
              <Text style={styles.infoText}>
                🕒 {seleccionado.horario_atencion}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}