import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import AdminSubHeader from '../../components/AdminSubHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import InfoRow from '../../components/InfoRow';
import ServicioAdminCard from '../../components/ServicioAdminCard';
import {
  eliminarServicioAdmin,
  eliminarUsuarioAdmin,
  getUsuarioAdmin,
  type ServicioAdmin,
  type UsuarioAdmin,
} from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useEliminacionConfirmada } from '../../hooks/useEliminacionConfirmada';
import { ETIQUETA_TIPO, formatearFecha, iniciales } from '../../utils/adminFormat';
import { logError, mensajeErrorUsuario } from '../../utils/errorApp';
import { colors } from '../../styles/theme';
import FondoEscena from '../../components/FondoEscena';
import Foto from '../../components/Foto';
import { styles } from '../../styles/Admin.styles';

export default function AdminUsuarioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { refrescar } = useAdmin();
  const [usuario, setUsuario] = useState<UsuarioAdmin | null>(null);
  const [servicios, setServicios] = useState<ServicioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const borrarUsuario = useEliminacionConfirmada<UsuarioAdmin>();
  const borrarServicio = useEliminacionConfirmada<ServicioAdmin>();
  const puedeEliminar = !!usuario && usuario._id !== user?._id;

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    setError(null);
    try {
      const r = await getUsuarioAdmin(id);
      setUsuario(r.data);
      setServicios(r.servicios);
    } catch (e) {
      logError('No se pudo cargar el usuario', e);
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

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  return (
    <FondoEscena>
    <View style={styles.screen}>
      <AdminSubHeader titulo="Detalle del usuario" volverA="/admin/usuarios" />

      <ScrollView contentContainerStyle={styles.content}>
        {cargando && !usuario && (
          <Loader tipo="bloque" texto="Cargando usuario…" />
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

        {!!usuario && (
          <>
            <View style={styles.profileBox}>
              <View style={[styles.avatar, { width: 72, height: 72, borderRadius: 36, overflow: 'hidden' }]}>
                {usuario.foto_perfil ? (
                  <Foto uri={usuario.foto_perfil} recyclingKey={usuario._id} style={{ width: 72, height: 72 }} />
                ) : (
                  <Text style={[styles.avatarText, { fontSize: 28 }]}>{iniciales(usuario.nombre)}</Text>
                )}
              </View>
              <Text style={styles.bigName}>{usuario.nombre}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{ETIQUETA_TIPO[usuario.tipo_usuario]}</Text>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <InfoRow icono="mail-outline" etiqueta="Correo electrónico" valor={usuario.email} />
              <InfoRow icono="call-outline" etiqueta="Teléfono" valor={usuario.telefono} />
              <InfoRow icono="calendar-outline" etiqueta="Fecha de registro" valor={formatearFecha(usuario.fecha_registro)} />
              <InfoRow icono="person-outline" etiqueta="Tipo de cuenta" valor={ETIQUETA_TIPO[usuario.tipo_usuario]} />
            </View>

            {puedeEliminar && (
              <Pressable
                style={[styles.btnDeleteWide, (borrarUsuario.borrando || borrarServicio.borrando) && styles.btnDisabled]}
                onPress={() => borrarUsuario.pedir(usuario)}
                disabled={borrarUsuario.borrando || borrarServicio.borrando}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar a ${usuario.nombre}`}>
                <Ionicons name="trash-outline" size={20} color={colors.rojo} />
                <Text style={styles.btnDeleteSmallText}>Eliminar usuario</Text>
              </Pressable>
            )}

            {usuario.tipo_usuario === 'negocio' && (
              <>
                <Text style={styles.sectionTitle}>Servicios del negocio ({servicios.length})</Text>
                {servicios.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Ionicons name="storefront-outline" size={36} color={colors.azul} />
                    <Text style={styles.emptyTitle}>Este negocio aún no tiene servicios</Text>
                  </View>
                ) : (
                  servicios.map((s) => (
                    <ServicioAdminCard
                      key={s._id}
                      servicio={s}
                      ocupado={borrarServicio.borrando || borrarUsuario.borrando}
                      onPress={() => router.push(`/admin/servicio/${s._id}`)}
                      onEliminar={() => borrarServicio.pedir(s)}
                    />
                  ))
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={!!borrarUsuario.objetivo}
        titulo="Eliminar usuario"
        mensaje={
          borrarUsuario.objetivo
            ? `${borrarUsuario.objetivo.nombre}\n${borrarUsuario.objetivo.email}\n${ETIQUETA_TIPO[borrarUsuario.objetivo.tipo_usuario] ?? borrarUsuario.objetivo.tipo_usuario}${
                borrarUsuario.objetivo.tipo_usuario === 'negocio'
                  ? `\n\nTambién se eliminarán sus ${servicios.length} servicios. Las reseñas se conservan.`
                  : ''
              }\n\n¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.`
            : '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.'
        }
        confirmarTexto="Eliminar"
        cargando={borrarUsuario.borrando}
        error={borrarUsuario.error}
        onCancel={borrarUsuario.cancelar}
        onConfirm={() =>
          void borrarUsuario.confirmar(async (cuenta) => {
            await eliminarUsuarioAdmin(cuenta._id);
            setAviso('Usuario eliminado correctamente');
            void refrescar();
            setTimeout(() => router.back(), 700);
          })
        }
      />

      <ConfirmDialog
        visible={!!borrarServicio.objetivo}
        titulo="Eliminar servicio"
        mensaje={`¿Estás seguro de que deseas eliminar «${borrarServicio.objetivo?.nombre ?? 'este establecimiento'}»? Esta acción no se puede deshacer.`}
        confirmarTexto="Eliminar"
        cargando={borrarServicio.borrando}
        error={borrarServicio.error}
        onCancel={borrarServicio.cancelar}
        onConfirm={() =>
          void borrarServicio.confirmar(async (servicio) => {
            await eliminarServicioAdmin(servicio._id);
            setServicios((prev) => prev.filter((s) => s._id !== servicio._id));
            setUsuario((prev) =>
              prev ? { ...prev, total_servicios: Math.max(0, (prev.total_servicios ?? servicios.length) - 1) } : prev,
            );
            setAviso('Servicio eliminado correctamente');
            void refrescar();
          })
        }
      />
    </View>
    </FondoEscena>
  );
}