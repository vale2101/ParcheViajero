import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import AdminSubHeader from '../../components/AdminSubHeader';
import EstadoBadge from '../../components/EstadoBadge';
import GaleriaServicio from '../../components/GaleriaServicio';
import InfoRow from '../../components/InfoRow';
import LocationPickerMap from '../../components/LocationPickerMap';
import { getServicioAdmin, revisarServicio, type RevisionEvento, type ServicioAdmin } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { useAlert } from '../../context/AlertContext';
import { formatearFecha, formatearFechaHora } from '../../utils/adminFormat';
import { logError, mensajeErrorUsuario } from '../../utils/errorApp';
import { getEstadoVisual } from '../../utils/estadoServicio';
import { coordenadasValidas, formatearPrecioCOP } from '../../utils/formatoServicio';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/Admin.styles';

type Decision = 'aprobado' | 'rechazado';

export default function AdminServicioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { refrescar: refrescarResumen } = useAdmin();
  const { confirmar, errorVital } = useAlert();

  const [servicio, setServicio] = useState<ServicioAdmin | null>(null);
  const [historial, setHistorial] = useState<RevisionEvento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [observacion, setObservacion] = useState('');
  const [errorObs, setErrorObs] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const enviandoRef = useRef(false);

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    setError(null);
    try {
      const r = await getServicioAdmin(id);
      setServicio(r.data);
      setHistorial(r.historial);
    } catch (e) {
      logError('No se pudo cargar el servicio', e);
      setError(mensajeErrorUsuario(e, 'No hemos podido obtener los datos'));
    } finally {
      setCargando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  const lat = servicio?.latitud;
  const lng = servicio?.longitud;
  const vista = useMemo(() => (lat !== undefined && lng !== undefined ? { lat, lng, zoom: 16, token: 1 } : null), [lat, lng]);
  const marcador = useMemo(() => (lat !== undefined && lng !== undefined ? { lat, lng } : null), [lat, lng]);

  async function pedirConfirmacion(d: Decision) {
    if (d === 'rechazado' && !observacion.trim()) {
      setErrorObs('Escribe el motivo del rechazo para poder rechazar el servicio');
      return;
    }
    setErrorObs(null);
    setErrorAccion(null);
    setAviso(null);

    const ok = await confirmar({
      titulo: d === 'aprobado' ? 'Aprobar servicio' : 'Rechazar servicio',
      mensaje:
        d === 'aprobado'
          ? `¿Aprobar «${servicio?.nombre ?? ''}»? Quedará publicado en el mapa de los viajeros.`
          : `¿Rechazar «${servicio?.nombre ?? ''}»? El negocio podrá ver tu observación.`,
      confirmarTexto: d === 'aprobado' ? 'Aprobar' : 'Rechazar',
      tono: d === 'aprobado' ? 'exito' : 'peligro',
    });
    if (!ok || !id || enviandoRef.current) return;

    enviandoRef.current = true;
    setEnviando(true);
    try {
      await revisarServicio(id, d, observacion.trim() || undefined);
      setObservacion('');
      setAviso(d === 'aprobado' ? 'Servicio aprobado correctamente' : 'Servicio rechazado correctamente');
    } catch (e) {
      setErrorAccion(
        errorVital(
          'No se pudo registrar la decisión',
          e,
          'Error en la base de datos. Inténtalo más tarde.',
          'No se pudo completar',
        ),
      );
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
      await cargar();
      void refrescarResumen();
    }
  }

  const pendiente = servicio?.estado_aprobacion === 'pendiente';

  return (
    <View style={styles.screen}>
      <AdminSubHeader titulo="Detalle del servicio" volverA="/admin/solicitudes" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {cargando && !servicio && (
          <Loader tipo="bloque" texto="Cargando servicio…" />
        )}

        {!!error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button text="Volver a intentar" onPress={cargar} secondary />
          </View>
        )}

        {!!aviso && (
          <View style={styles.okBox} accessibilityLiveRegion="polite">
            <Ionicons name="checkmark-circle" size={20} color={colors.verde} />
            <Text style={styles.okText}>{aviso}</Text>
          </View>
        )}

        {!!errorAccion && (
          <View style={styles.errorCard} accessibilityLiveRegion="polite">
            <Text style={styles.errorText}>{errorAccion}</Text>
          </View>
        )}

        {!!servicio && (
          <>
            <GaleriaServicio imagenes={servicio.imagenes ?? []} categoria={servicio.categoria_nombre} />

            <Text style={styles.bigName}>{servicio.nombre}</Text>
            <EstadoBadge estado={servicio.estado_aprobacion} />

            {servicio.estado_aprobacion === 'rechazado' && !!servicio.observacion_revision && (
              <View style={styles.rejectBox}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.rojo} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rejectTitle}>Observación del rechazo vigente</Text>
                  <Text style={styles.rejectText}>{servicio.observacion_revision}</Text>
                </View>
              </View>
            )}

            <View style={styles.sectionCard}>
              <InfoRow icono="pricetag-outline" etiqueta="Categoría" valor={servicio.categoria_nombre} />
              <InfoRow icono="document-text-outline" etiqueta="Descripción" valor={servicio.descripcion} />
              <InfoRow icono="business-outline" etiqueta="Municipio" valor={servicio.municipio_nombre} />
              <InfoRow icono="location-outline" etiqueta="Dirección" valor={servicio.direccion} />
              <InfoRow icono="call-outline" etiqueta="Teléfono" valor={servicio.telefono} />
              <InfoRow icono="time-outline" etiqueta="Horario de atención" valor={servicio.horario_atencion} />
              <InfoRow
                icono="cash-outline"
                etiqueta="Precio"
                valor={servicio.precio !== undefined ? formatearPrecioCOP(servicio.precio) : undefined}
              />
              <InfoRow icono="calendar-outline" etiqueta="Fecha de creación" valor={formatearFecha(servicio.fecha_creacion)} />
            </View>

            {coordenadasValidas(servicio.latitud, servicio.longitud) && (
              <LocationPickerMap key={servicio._id} vista={vista} marcador={marcador} interactivo={false} height={220} />
            )}

            <Text style={styles.sectionTitle}>Negocio propietario</Text>
            <View style={styles.sectionCard}>
              <InfoRow icono="storefront-outline" etiqueta="Nombre" valor={servicio.propietario?.nombre} />
              <InfoRow icono="mail-outline" etiqueta="Correo" valor={servicio.propietario?.email} />
              <InfoRow icono="call-outline" etiqueta="Teléfono" valor={servicio.propietario?.telefono} />
              {!!servicio.propietario && (
                <Button
                  text="Ver negocio"
                  onPress={() => router.push(`/admin/persona/${servicio.propietario?._id}`)}
                  secondary
                />
              )}
            </View>

            <Text style={styles.sectionTitle}>Historial de revisión</Text>
            <View style={styles.sectionCard}>
              {historial.length === 0 ? (
                <Text style={styles.centerText}>
                  Sin decisiones registradas. Aquí aparecerán las aprobaciones y rechazos de este servicio.
                </Text>
              ) : (
                historial.map((h) => {
                  const nuevo = getEstadoVisual(h.estado_nuevo);
                  const anterior = getEstadoVisual(h.estado_anterior);
                  return (
                    <View key={h._id} style={styles.histItem}>
                      <Ionicons name={nuevo.icono} size={22} color={nuevo.fg} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.histTitle}>
                          {anterior.texto} → {nuevo.texto}
                        </Text>
                        <Text style={styles.histMeta}>
                          {formatearFechaHora(h.fecha)} · {h.admin_nombre ?? 'Administrador'}
                        </Text>
                        {!!h.observacion && <Text style={styles.histObs}>“{h.observacion}”</Text>}
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {pendiente && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Revisión administrativa</Text>
                <Text style={styles.infoLabel}>
                  Observaciones (obligatorias para rechazar, opcionales para aprobar)
                </Text>
                <TextInput
                  style={[styles.obsInput, !!errorObs && styles.obsInputError]}
                  value={observacion}
                  onChangeText={(t) => {
                    setObservacion(t);
                    if (errorObs) setErrorObs(null);
                  }}
                  placeholder="Escribe el motivo o tus comentarios…"
                  placeholderTextColor={colors.placeholder}
                  multiline
                  editable={!enviando}
                />
                <Text style={styles.obsCounter}>{observacion.length} caracteres</Text>
                {!!errorObs && <Text style={styles.fieldError}>{errorObs}</Text>}

                <View style={styles.actionsRow}>
                  <Pressable
                    style={[styles.btnAction, styles.btnApprove, enviando && styles.btnDisabled]}
                    onPress={() => pedirConfirmacion('aprobado')}
                    disabled={enviando}
                    accessibilityRole="button">
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.btnApproveText}>Aprobar servicio</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btnAction, styles.btnReject, enviando && styles.btnDisabled]}
                    onPress={() => pedirConfirmacion('rechazado')}
                    disabled={enviando}
                    accessibilityRole="button">
                    <Ionicons name="close-circle-outline" size={20} color={colors.rojo} />
                    <Text style={styles.btnRejectText}>Rechazar servicio</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

    </View>
  );
}