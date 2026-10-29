import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import AdminSubHeader from '../../components/AdminSubHeader';
import InfoRow from '../../components/InfoRow';
import ServicioAdminCard from '../../components/ServicioAdminCard';
import { getUsuarioAdmin, type ServicioAdmin, type UsuarioAdmin } from '../../api/admin';
import { ETIQUETA_TIPO, formatearFecha, iniciales } from '../../utils/adminFormat';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/Admin.styles';

export default function AdminUsuarioDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioAdmin | null>(null);
  const [servicios, setServicios] = useState<ServicioAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!id) return;
    setCargando(true);
    setError(null);
    try {
      const r = await getUsuarioAdmin(id);
      setUsuario(r.data);
      setServicios(r.servicios);
    } catch (e) {
      setError((e as Error).message || 'No se pudo cargar el usuario');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void cargar();
    }, [cargar]),
  );

  return (
    <View style={styles.screen}>
      <AdminSubHeader titulo="Detalle del usuario" volverA="/admin/usuarios" />

      <ScrollView contentContainerStyle={styles.content}>
        {cargando && !usuario && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.azul} />
          </View>
        )}

        {!!error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button text="Volver a intentar" onPress={cargar} secondary />
          </View>
        )}

        {!!usuario && (
          <>
            <View style={styles.profileBox}>
              <View style={[styles.avatar, { width: 72, height: 72, borderRadius: 36, overflow: 'hidden' }]}>
                {usuario.foto_perfil ? (
                  <Image source={{ uri: usuario.foto_perfil }} style={{ width: 72, height: 72 }} />
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
                    <ServicioAdminCard key={s._id} servicio={s} onPress={() => router.push(`/admin/servicio/${s._id}`)} />
                  ))
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}