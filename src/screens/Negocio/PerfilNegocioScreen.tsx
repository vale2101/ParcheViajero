import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import PerfilEditModal from '../../components/PerfilEditModal';
import ServicioCard from '../../components/ServicioCard';
import ServicioEditarModal from '../../components/ServicioEditarModal';
import { useAuth } from '../../context/AuthContext';
import { useMisServicios } from '../../hooks/useMisServicios';
import { deleteServicio, type Servicio } from '../../api/servicio';
import { styles as botones } from '../../styles/Button.styles';
import { styles } from '../../styles/PerfilNegocio.styles';

export default function PerfilNegocioScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    servicios,
    categorias,
    municipios,
    categoriasPorId,
    municipiosPorId,
    cargando,
    cargado,
    error,
    recargar,
    quitar,
  } = useMisServicios();

  const [editando, setEditando] = useState<Servicio | null>(null);
  const [porBorrar, setPorBorrar] = useState<Servicio | null>(null);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const borrandoRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  const sesionExpirada = !!error && /no autenticado|token inv|expirad/i.test(error);

  async function eliminar() {
    if (!porBorrar || borrandoRef.current) return;
    borrandoRef.current = true;
    setBorrando(true);
    setErrorBorrado(null);

    try {
      await deleteServicio(porBorrar._id);
      quitar(porBorrar._id);
      setPorBorrar(null);
      setAviso('Servicio eliminado correctamente');
    } catch (e) {
      setErrorBorrado((e as Error).message || 'No se pudo eliminar el servicio');
    } finally {
      borrandoRef.current = false;
      setBorrando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.email.charAt(0).toUpperCase() ?? '?'}</Text>
          </View>
          <Text style={styles.name}>{user?.nombre}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {!!user?.telefono && <Text style={styles.phone}>{user.telefono}</Text>}
        </View>

        {!!aviso && (
          <View style={styles.aviso} accessibilityLiveRegion="polite">
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <Text style={styles.avisoText}>{aviso}</Text>
          </View>
        )}

        <View style={styles.buttonsRow}>
          <Pressable
            style={[botones.base, botones.primary, styles.profileBtn]}
            onPress={() => setEditandoPerfil(true)}
            accessibilityRole="button">
            <Ionicons name="pencil" size={18} color="#FEBA03" />
            <Text style={styles.profileBtnText}>Editar perfil</Text>
          </Pressable>

          <Button text="Cerrar sesión" onPress={logout} secondary style={{ flex: 1 }} />
        </View>

        {/* Servicios del usuario (sin título) */}
        {cargando && !cargado && (
          <Loader tipo="bloque" texto="Cargando tus servicios…" />
        )}

        {!!error && (
          <View style={styles.errorCard}>
            <Ionicons name="cloud-offline-outline" size={22} color="#dc2626" />
            <Text style={styles.errorText}>
              {sesionExpirada
                ? 'Tu sesión expiró. Cierra sesión e inicia de nuevo para ver tus servicios.'
                : error}
            </Text>
            {!sesionExpirada && <Button text="Volver a intentar" onPress={recargar} secondary />}
          </View>
        )}

        {cargado && !error && servicios.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="storefront-outline" size={36} color="#0147B9" />
            <Text style={styles.emptyText}>No tienes servicios registrados</Text>
            <Button
              text="＋ Publicar mi primer servicio"
              onPress={() => router.push('/negocio/nuevo-servicio')}
            />
          </View>
        )}

        {servicios.map((s) => (
          <ServicioCard
            key={s._id}
            servicio={s}
            categoria={categoriasPorId[s.categoria_id]}
            municipio={municipiosPorId[s.municipio_id]}
            ocupado={borrando}
            onEditar={() => setEditando(s)}
            onEliminar={() => {
              setErrorBorrado(null);
              setPorBorrar(s);
            }}
          />
        ))}
      </ScrollView>

      <ServicioEditarModal
        visible={!!editando}
        servicio={editando}
        categorias={categorias}
        municipios={municipios}
        municipioActual={editando ? municipiosPorId[editando.municipio_id] : undefined}
        onClose={() => setEditando(null)}
        onSaved={() => {
          recargar();
          setAviso('Servicio actualizado correctamente');
        }}
        onImagenesChange={recargar}

      />

      <ConfirmDialog
        visible={!!porBorrar}
        titulo="Eliminar servicio"
        mensaje={`¿Seguro que quieres eliminar «${porBorrar?.nombre ?? ''}»? Esta acción no se puede deshacer.`}
        confirmarTexto="Eliminar"
        cargando={borrando}
        error={errorBorrado}
        onCancel={() => setPorBorrar(null)}
        onConfirm={eliminar}
      />

      <PerfilEditModal
        visible={editandoPerfil}
        onClose={() => setEditandoPerfil(false)}
        onSaved={() => setAviso('Perfil actualizado correctamente')}
      />
    </View>
  );
}