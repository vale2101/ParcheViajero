import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import EntradaPantalla from '../../components/EntradaPantalla';
import DecoRutaCinta from '../../components/DecoRutaCinta';
import MontanasDeco from '../../components/MontanasDeco';
import StatCard from '../../components/StatCard';
import { SkeletonStat } from '../../components/Skeleton';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { iniciales } from '../../utils/adminFormat';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/Admin.styles';
import { useResponsive } from '../../hooks/useResponsive';

const ACCESOS: { ruta: Href; icono: keyof typeof Ionicons.glyphMap; titulo: string; desc: string }[] = [
  { ruta: '/admin/solicitudes', icono: 'document-text-outline', titulo: 'Solicitudes de servicios', desc: 'Revisa y decide los servicios pendientes' },
  { ruta: '/admin/servicios', icono: 'time-outline', titulo: 'Historial de servicios', desc: 'Todos los servicios y sus decisiones' },
  { ruta: '/admin/usuarios', icono: 'people-outline', titulo: 'Usuarios registrados', desc: 'Consulta negocios y viajeros' },
  { ruta: '/admin/resenas', icono: 'chatbubbles-outline', titulo: 'Reseñas', desc: 'Busca y elimina reseñas de los viajeros' },
];

export default function AdminInicioScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { resumen, cargando, error, refrescar } = useAdmin();
  const { pad, maxContenido } = useResponsive();
  const [tirando, setTirando] = useState(false);

  async function alTirar() {
    setTirando(true);
    try {
      await refrescar();
    } finally {
      setTirando(false);
    }
  }

  function irA(ruta: '/admin/solicitudes' | '/admin/servicios' | '/admin/usuarios', params: Record<string, string>) {
    router.push({ pathname: ruta, params: { ...params, destino: String(Date.now()) } });
  }

  useFocusEffect(
    useCallback(() => {
      void refrescar();
    }, [refrescar]),
  );

  return (
    <View style={styles.screen}>
      <AdminHeader />
      <EntradaPantalla>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: pad, maxWidth: maxContenido }]}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        refreshControl={<RefreshControl refreshing={tirando} onRefresh={() => void alTirar()} />}>
        <View style={styles.adminBar}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales(user?.nombre)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminName} numberOfLines={1}>
              {user?.nombre}
            </Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.doradoTexto} />
              <Text style={styles.roleText}>Administrador</Text>
            </View>
          </View>
          <Pressable style={styles.iconBtn} onPress={logout} accessibilityRole="button" accessibilityLabel="Cerrar sesión">
            <Ionicons name="log-out-outline" size={26} color={colors.rojo} />
          </Pressable>
        </View>

        <View style={styles.greetingCard}>
          <Text style={styles.greetingTitle}>¡Hola, {user?.nombre?.split(' ')[0] ?? 'admin'}!</Text>
          <Text style={styles.greetingText}>Gestiona los servicios y usuarios de Parche Viajero.</Text>
          <MontanasDeco />
        </View>

        {!!error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button text="Volver a intentar" onPress={refrescar} secondary />
          </View>
        )}

        <View style={styles.statGrid}>
          {cargando && !resumen ? (
            <>
              <View style={styles.statRow}>
                <SkeletonStat />
                <SkeletonStat />
              </View>
              <View style={styles.statRow}>
                <SkeletonStat />
                <SkeletonStat />
              </View>
            </>
          ) : (
            <>
              <View style={styles.statRow}>
                <StatCard
                  icono="time-outline"
                  color={colors.doradoTexto}
                  valor={resumen?.pendientes ?? null}
                  etiqueta="Solicitudes pendientes"
                  onPress={() => irA('/admin/solicitudes', { estado: 'pendiente' })}
                />
                <StatCard
                  icono="storefront-outline"
                  color={colors.azul}
                  valor={resumen?.totalServicios ?? null}
                  etiqueta="Servicios registrados"
                  onPress={() => irA('/admin/servicios', { estado: 'todos' })}
                />
              </View>
              <View style={styles.statRow}>
                <StatCard
                  icono="briefcase-outline"
                  color={colors.azulOscuro}
                  valor={resumen?.negocios ?? null}
                  etiqueta="Negocios"
                  onPress={() => irA('/admin/usuarios', { tipo: 'negocio' })}
                />
                <StatCard
                  icono="airplane-outline"
                  color={colors.verde}
                  valor={resumen?.viajeros ?? null}
                  etiqueta="Viajeros"
                  onPress={() => irA('/admin/usuarios', { tipo: 'registrado' })}
                />
              </View>
            </>
          )}
        </View>

        <View style={styles.accesosHeader}>
          <Text style={[styles.sectionTitle, { flexShrink: 1 }]}>Accesos rápidos</Text>
          <DecoRutaCinta />
        </View>
        {ACCESOS.map((a) => {
          const pendientes = a.ruta === '/admin/solicitudes' ? resumen?.pendientes : undefined;
          return (
            <Pressable key={a.titulo} style={styles.accessCard} onPress={() => router.push(a.ruta)} accessibilityRole="button">
              <View style={styles.accessIcon}>
                <Ionicons name={a.icono} size={22} color={colors.azul} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accessTitle}>{a.titulo}</Text>
                <Text style={styles.accessDesc}>{a.desc}</Text>
              </View>
              {typeof pendientes === 'number' && pendientes > 0 && (
                <View style={styles.accessBadge} accessibilityLabel={`${pendientes} solicitudes pendientes`}>
                  <Text style={styles.accessBadgeText}>{pendientes > 99 ? '99+' : pendientes}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color={colors.azul} />
            </Pressable>
          );
        })}
      </ScrollView>
      </EntradaPantalla>
    </View>
  );
}