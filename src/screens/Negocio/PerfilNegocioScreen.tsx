import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import PerfilDrawer from '../../components/PerfilDrawer';
import Button from '../../components/Button';
import DecoRutaCinta from '../../components/DecoRutaCinta';
import MontanasDeco from '../../components/MontanasDeco';
import EntradaPantalla from '../../components/EntradaPantalla';
import ScreenHeader from '../../components/ScreenHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import PerfilEditModal from '../../components/PerfilEditModal';
import ServicioCard from '../../components/ServicioCard';
import ServicioEditarModal from '../../components/ServicioEditarModal';
import InfoModal from '../../components/InfoModal';
import { useAuth } from '../../context/AuthContext';
import { useMisServicios } from '../../hooks/useMisServicios';
import { deleteServicio, type Servicio } from '../../api/servicio';
import { styles as botones } from '../../styles/Button.styles';
import { styles } from '../../styles/PerfilNegocio.styles';
import { useResponsive } from '../../hooks/useResponsive';

export default function PerfilNegocioScreen() {
  const { user, logout } = useAuth();
  const { pad, maxContenido } = useResponsive();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [infoModal, setInfoModal] = useState<{ titulo: string; texto: string } | null>(null);
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

  // Función para el drawer
  function handleEditar() {
    setMenuVisible(false);
    setTimeout(() => setAviso('Esta opción estará disponible pronto.'), 300);
  }

  function handleAcerca() {
    setMenuVisible(false);
    setInfoModal({
      titulo: 'Acerca de la app',
      texto: 'Parche Viajero te ayuda a descubrir restaurantes, hoteles y lugares turísticos de Caldas, y a conocer lo que opinan otros viajeros.',
    });
  }

  function handleTerminos() {
    setMenuVisible(false);
    setInfoModal({
      titulo: 'Términos y condiciones',
      texto: 'Al usar Parche Viajero aceptas que tus reseñas sean públicas y que debes escribirlas con respeto. Esta app es un proyecto universitario.',
    });
  }

  return (
    <View style={styles.screen}>
      <EntradaPantalla>
      <ScreenHeader onPressMenu={() => setMenuVisible(true)} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: pad, maxWidth: maxContenido, alignSelf: 'center', width: '100%' },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.papelMancha1} pointerEvents="none" />
          <View style={styles.papelMancha2} pointerEvents="none" />
          <View style={styles.decoTopLeft} pointerEvents="none">
            <DecoRutaCinta />
          </View>
          <View style={styles.decoTopRight} pointerEvents="none">
            <MontanasDeco />
          </View>
          <View style={styles.profileHeader}>
            <View style={styles.anillo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.nombre?.trim()?.[0] || user?.email?.[0] || '?').toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{user?.nombre}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {!!user?.telefono && <Text style={styles.phone}>{user.telefono}</Text>}
          </View>
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

        <View style={styles.pie} pointerEvents="none">
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoFondo}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        </View>
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

      <PerfilDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEditar={handleEditar}
        onAcerca={handleAcerca}
        onTerminos={handleTerminos}
        onCerrarSesion={logout}
      />

      <InfoModal
        visible={!!infoModal}
        titulo={infoModal?.titulo ?? ''}
        texto={infoModal?.texto ?? ''}
        onClose={() => setInfoModal(null)}
      />
      </EntradaPantalla>
    </View>
  );
}