import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import AdminSubHeader from '../../components/AdminSubHeader';
import EstadoBadge from '../../components/EstadoBadge';
import GaleriaServicio, { TiraImagenes } from '../../components/GaleriaServicio';
import InfoRow from '../../components/InfoRow';
import LocationPickerMap from '../../components/LocationPickerMap';
import ConfirmDialog from '../../components/ConfirmDialog';
import { getServicioAdmin, revisarServicio, type RevisionEvento, type ServicioAdmin } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { formatearFecha, formatearFechaHora } from '../../utils/adminFormat';
import { getEstadoVisual } from '../../utils/estadoServicio';
import { coordenadasValidas, formatearPrecioCOP } from '../../utils/formatoServicio';
import CategoriaSticker from '../../components/CategoriaSticker';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/Admin.styles';

type Decision = 'aprobado' | 'rechazado';

export default function AdminServicioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { refrescar: refrescarResumen } = useAdmin();

  const [servicio, setServicio] = useState<ServicioAdmin | null>(null);
  const [historial, setHistorial] = useState<RevisionEvento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [observacion, setObservacion] = useState('');
  const [errorObs, setErrorObs] = useState<string | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [indiceFoto, setIndiceFoto] = useState(0);
  const enviandoRef = useRef(false);
  const { width } = useWindowDimensions();

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    setError(null);
    try {
      const r = await getServicioAdmin(id);
      setServicio(r.data);
      setHistorial(r.historial);
    } catch (e) {
      setError((e as Error).message || 'No se pudo cargar el servicio');
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

  function pedirConfirmacion(d: Decision) {
    if (d === 'rechazado' && !observacion.trim()) {
      setErrorObs('Escribe el motivo del rechazo para poder rechazar el servicio');
      return;
    }
    setErrorObs(null);
    setErrorAccion(null);
    setAviso(null);
    setDecision(d);
  }

  async function confirmar() {
    if (!decision || !id || enviandoRef.current) return;
    enviandoRef.current = true;
    setEnviando(true);

    const tomada = decision;
    try {
      await revisarServicio(id, tomada, observacion.trim() || undefined);
      setDecision(null);
      setObservacion('');
      setAviso(tomada === 'aprobado' ? 'Servicio aprobado correctamente' : 'Servicio rechazado correctamente');
    } catch (e) {
      setDecision(null);
      setErrorAccion((e as Error).message || 'No se pudo registrar la decisión');
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
      // En éxito o en conflicto (otra sesión ya decidió) se refrescan datos e indicadores
      await cargar();
      void refrescarResumen();
    }
  }

  useEffect(() => {
    setIndiceFoto(0);
  }, [servicio?._id]);

  const pendiente = servicio?.estado_aprobacion === 'pendiente';
  const municipio = servicio?.municipio_nombre?.trim();
  const municipioLineas = municipio ? municipio.split(',').map((parte) => parte.trim()).filter(Boolean) : [];
  const stickerFlotante = !!municipio && width >= 340;

  return (
    <View style={styles.screen}>
      <AdminSubHeader titulo="Detalle del servicio" volverA="/admin/solicitudes" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {cargando && !servicio && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.azul} />
            <Text style={styles.centerText}>Cargando…</Text>
          </View>
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
            <GaleriaServicio
              imagenes={servicio.imagenes ?? []}
              categoria={servicio.categoria_nombre}
              indice={indiceFoto}
              onIndice={setIndiceFoto}
            />

            <View style={styles.detailTitleRow}>
              <Text style={[styles.bigName, { flex: 1 }]}>{servicio.nombre}</Text>
              <EstadoBadge estado={servicio.estado_aprobacion} corto />
            </View>

            {servicio.estado_aprobacion === 'rechazado' && !!servicio.observacion_revision && (
              <View style={styles.rejectBox}>
                <Ionicons name="alert-circle-outline" size={18} color={colors.rojo} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rejectTitle}>Observación del rechazo vigente</Text>
                  <Text style={styles.rejectText}>{servicio.observacion_revision}</Text>
                </View>
              </View>
            )}

            <CategoriaSticker nombre={servicio.categoria_nombre} />

            <View style={[styles.detailBlock, !stickerFlotante && styles.detailBlockEstrecho]}>
              <InfoRow icono="location-outline" etiqueta="Municipio" valor={servicio.municipio_nombre} compacto />
              <InfoRow icono="navigate-outline" etiqueta="Dirección" valor={servicio.direccion} compacto />
              <InfoRow icono="call-outline" etiqueta="Teléfono" valor={servicio.telefono} compacto />
              <InfoRow icono="time-outline" etiqueta="Horario de atención" valor={servicio.horario_atencion} compacto />
              <InfoRow
                icono="cash-outline"
                etiqueta="Precio"
                valor={servicio.precio !== undefined ? formatearPrecioCOP(servicio.precio) : undefined}
                compacto
              />
              <InfoRow icono="calendar-outline" etiqueta="Fecha de creación" valor={formatearFecha(servicio.fecha_creacion)} compacto />
              {!!municipio && (
                <View
                  style={[styles.sticker, !stickerFlotante && styles.stickerFlujo]}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants">
                  <Ionicons name="location" size={16} color={colors.azul} />
                  {municipioLineas.map((linea) => (
                    <Text key={linea} style={styles.stickerText}>
                      {linea}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.bodyText}>{servicio.descripcion?.trim() || 'No especificado'}</Text>
            </View>

            {(servicio.imagenes?.length ?? 0) > 1 && (
              <View style={{ gap: 10 }}>
                <Text style={styles.sectionTitle}>Imágenes</Text>
                <TiraImagenes imagenes={servicio.imagenes ?? []} indice={indiceFoto} onSelect={setIndiceFoto} />
              </View>
            )}

            {pendiente && (
              <View style={{ gap: 8 }}>
                <Text style={styles.sectionTitle}>Observaciones (opcional)</Text>
                <Text style={styles.infoLabel}>Obligatorias solo si rechazas el servicio.</Text>
                <TextInput
                  style={[styles.obsInput, !!errorObs && styles.obsInputError]}
                  value={observacion}
                  onChangeText={(t) => {
                    setObservacion(t);
                    if (errorObs) setErrorObs(null);
                  }}
                  placeholder="Escribe una observación para el negocio…"
                  placeholderTextColor={colors.placeholder}
                  multiline
                  maxLength={500}
                  editable={!enviando}
                />
                <Text style={styles.obsCounter}>{observacion.length}/500</Text>
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

            {coordenadasValidas(servicio.latitud, servicio.longitud) && (
              <View style={styles.mapFrame}>
                <LocationPickerMap key={servicio._id} vista={vista} marcador={marcador} interactivo={false} height={220} />
              </View>
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
          </>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={!!decision}
        titulo={decision === 'aprobado' ? 'Aprobar servicio' : 'Rechazar servicio'}
        mensaje={
          decision === 'aprobado'
            ? `¿Aprobar «${servicio?.nombre ?? ''}»? Quedará publicado en el mapa de los viajeros.`
            : `¿Rechazar «${servicio?.nombre ?? ''}»? El negocio podrá ver tu observación.`
        }
        confirmarTexto={decision === 'aprobado' ? 'Aprobar' : 'Rechazar'}
        tono={decision === 'aprobado' ? 'exito' : 'peligro'}
        cargando={enviando}
        error={null}
        onCancel={() => setDecision(null)}
        onConfirm={confirmar}
      />
    </View>
  );
}