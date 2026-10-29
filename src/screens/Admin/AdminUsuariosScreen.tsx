import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import SearchBar from '../../components/SearchBar';
import Segmented from '../../components/Segmented';
import UsuarioCard from '../../components/UsuarioCard';
import type { Orden, TipoCuenta } from '../../api/admin';
import { useAdminUsuarios } from '../../hooks/useAdminUsuarios';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/Admin.styles';

export default function AdminUsuariosScreen() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoCuenta>('negocio');
  const [q, setQ] = useState('');
  const [orden, setOrden] = useState<Orden>('desc');
  const [soloConServicios, setSoloConServicios] = useState(false);

  const { usuarios, cargando, cargado, error, recargar } = useAdminUsuarios(
    tipo,
    q,
    orden,
  );

  const visibles = useMemo(
    () =>
      tipo === 'negocio' && soloConServicios
        ? usuarios.filter((u) => (u.total_servicios ?? 0) > 0)
        : usuarios,
    [usuarios, tipo, soloConServicios],
  );

  return (
    <View style={styles.screen}>
      <AdminHeader />

      <View style={[styles.wrap, styles.headerBox]}>
        <Text style={styles.title}>Usuarios</Text>

        <Segmented
          valor={tipo}
          opciones={[
            { valor: 'negocio', etiqueta: 'Negocios' },
            { valor: 'registrado', etiqueta: 'Viajeros' },
          ]}
          onChange={setTipo}
        />

        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Buscar por nombre o correo"
        />

        <View style={styles.chipsRow}>
          <Pressable
            style={[styles.chip, styles.chipActive]}
            onPress={() =>
              setOrden((o) => (o === 'desc' ? 'asc' : 'desc'))
            }
            accessibilityRole="button"
          >
            <Text style={[styles.chipText, styles.chipTextActive]}>
              {orden === 'desc' ? 'Más recientes' : 'Más antiguos'}
            </Text>
          </Pressable>

          {tipo === 'negocio' && (
            <Pressable
              style={[styles.chip, soloConServicios && styles.chipActive]}
              onPress={() => setSoloConServicios((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ selected: soloConServicios }}
            >
              <Text
                style={[
                  styles.chipText,
                  soloConServicios && styles.chipTextActive,
                ]}
              >
                Con servicios
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={visibles}
        keyExtractor={(u) => u._id}
        contentContainerStyle={styles.content}
        refreshing={cargando && cargado}
        onRefresh={recargar}
        ListHeaderComponent={
          error ? (
            <View style={styles.errorCard}>
              <Ionicons
                name="cloud-offline-outline"
                size={22}
                color={colors.rojo}
              />
              <Text style={styles.errorText}>{error}</Text>
              <Button
                text="Volver a intentar"
                onPress={recargar}
                secondary
              />
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          cargando ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.azul} />
              <Text style={styles.centerText}>Cargando…</Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="people-outline"
                  size={40}
                  color={colors.azul}
                />
              </View>

              <Text style={styles.emptyTitle}>
                {q.trim() || soloConServicios
                  ? 'No hay usuarios con esos filtros'
                  : tipo === 'negocio'
                    ? 'Aún no hay negocios registrados'
                    : 'Aún no hay viajeros registrados'}
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <UsuarioCard
            usuario={item}
            onPress={() => router.push(`/admin/persona/${item._id}`)}
          />
        )}
      />
    </View>
  );
}
