import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import AdminHeader from '../../components/AdminHeader';
import SearchBar from '../../components/SearchBar';
import Segmented from '../../components/Segmented';
import UsuarioCard from '../../components/UsuarioCard';
import ConfirmDialog from '../../components/ConfirmDialog';
import { eliminarUsuarioAdmin, type Orden, type TipoCuenta, type UsuarioAdmin } from '../../api/admin';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { useAdminUsuarios } from '../../hooks/useAdminUsuarios';
import { useEliminacionConfirmada } from '../../hooks/useEliminacionConfirmada';
import { ETIQUETA_TIPO } from '../../utils/adminFormat';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/Admin.styles';

export default function AdminUsuariosScreen() {
  const router = useRouter();
  const { tipo: tipoParam, destino } = useLocalSearchParams<{ tipo?: string; destino?: string }>();
  const destinoAplicado = useRef<string | undefined>(undefined);
  const { user } = useAuth();
  const { refrescar } = useAdmin();
  const [tipo, setTipo] = useState<TipoCuenta>('negocio');
  const [q, setQ] = useState('');
  const [orden, setOrden] = useState<Orden>('desc');
  const [soloConServicios, setSoloConServicios] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const borrado = useEliminacionConfirmada<UsuarioAdmin>();

  const { usuarios, cargando, cargado, error, recargar, quitar } = useAdminUsuarios(
    tipo,
    q,
    orden,
  );

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  useEffect(() => {
    const marca = primerParam(destino);
    const pedido = primerParam(tipoParam);
    if (!marca || destinoAplicado.current === marca) return;
    if (pedido !== 'negocio' && pedido !== 'registrado') return;
    destinoAplicado.current = marca;
    setTipo(pedido);
    setQ('');
    setSoloConServicios(false);
  }, [destino, tipoParam]);

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
          <View style={{ gap: 12 }}>
            {!!aviso && (
              <View style={styles.okBox} accessibilityLiveRegion="polite">
                <Ionicons name="checkmark-circle" size={20} color={colors.verde} />
                <Text style={styles.okText}>{aviso}</Text>
              </View>
            )}
            {!!error && (
              <View style={styles.errorCard}>
                <Ionicons name="cloud-offline-outline" size={22} color={colors.rojo} />
                <Text style={styles.errorText}>{error}</Text>
                <Button text="Volver a intentar" onPress={recargar} secondary />
              </View>
            )}
          </View>
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
            ocupado={borrado.borrando}
            onPress={() => router.push(`/admin/persona/${item._id}`)}
            onEliminar={user?._id === item._id ? undefined : () => borrado.pedir(item)}
          />
        )}
      />

      <ConfirmDialog
        visible={!!borrado.objetivo}
        titulo="Eliminar usuario"
        mensaje={mensajeEliminarUsuario(borrado.objetivo)}
        confirmarTexto="Eliminar"
        cargando={borrado.borrando}
        error={borrado.error}
        onCancel={borrado.cancelar}
        onConfirm={() =>
          void borrado.confirmar(async (usuario) => {
            await eliminarUsuarioAdmin(usuario._id);
            quitar(usuario._id);
            setAviso('Usuario eliminado correctamente');
            void refrescar();
          })
        }
      />
    </View>
  );
}

function primerParam(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

function mensajeEliminarUsuario(usuario: UsuarioAdmin | null): string {
  const identidad = usuario
    ? `${usuario.nombre}\n${usuario.email}\n${ETIQUETA_TIPO[usuario.tipo_usuario] ?? usuario.tipo_usuario}${
        usuario.tipo_usuario === 'negocio'
          ? `\n\nTambién se eliminarán sus ${usuario.total_servicios ?? 0} servicios. Las reseñas se conservan.`
          : ''
      }\n\n`
    : '';
  return `${identidad}¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.`;
}
