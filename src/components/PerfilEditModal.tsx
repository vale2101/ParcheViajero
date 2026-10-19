import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Field from '../components/Field';
import { useAuth } from '../context/AuthContext';
import { updateUsuario } from '../api/usuario';
import { reglaEmail, reglaNombre, reglaTelefonoOpcional } from '../utils/validaciones';
import { logError, mensajeErrorUsuario } from '../utils/errorApp';
import { styles } from '../styles/PerfilNegocio.styles';

type PerfilForm = { nombre: string; email: string; telefono: string };

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function PerfilEditModal({ visible, onClose, onSaved }: Props) {
  const { user, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();
  const enviandoRef = useRef(false);
  const [guardando, setGuardando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const form = useForm<PerfilForm>({
    defaultValues: { nombre: '', email: '', telefono: '' },
  });

  useEffect(() => {
    if (!visible || !user) return;
    form.reset({ nombre: user.nombre, email: user.email, telefono: user.telefono ?? '' });
    setErrorEnvio(null);
  }, [visible]);

  const reglaTelefono = user?.telefono
    ? { ...reglaTelefonoOpcional, required: 'El teléfono no puede quedar vacío' }
    : reglaTelefonoOpcional;

  function cerrar() {
    if (enviandoRef.current) return;
    onClose();
  }

  const guardar = form.handleSubmit(async (v) => {
    if (!user || enviandoRef.current) return;
    setErrorEnvio(null);

    const cambios: { nombre?: string; email?: string; telefono?: string } = {};
    if (v.nombre.trim() !== user.nombre) cambios.nombre = v.nombre.trim();
    if (v.email.trim() !== user.email) cambios.email = v.email.trim();
    if (v.telefono.trim() && v.telefono.trim() !== (user.telefono ?? '')) {
      cambios.telefono = v.telefono.trim();
    }

    if (Object.keys(cambios).length === 0) {
      onClose();
      return;
    }

    enviandoRef.current = true;
    setGuardando(true);
    try {
      await updateUsuario(user._id, cambios);
    } catch (e) {
      logError('No se pudo actualizar el perfil', e);
      setErrorEnvio(mensajeErrorUsuario(e, 'Error en la base de datos. Inténtalo más tarde.'));
      enviandoRef.current = false;
      setGuardando(false);
      return;
    }

    try {
      await refreshUser(); 
    } catch (e) {
      logError('No se pudo refrescar el perfil después de guardar', e);
    }

    enviandoRef.current = false;
    setGuardando(false);
    onSaved();
    onClose();
  });

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={cerrar}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={[
            styles.backdropCenter,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
          ]}>
          <View style={styles.cardCenter}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Editar perfil</Text>
              <Pressable
                style={styles.closeBtn}
                onPress={cerrar}
                accessibilityRole="button"
                accessibilityLabel="Cerrar">
                <Ionicons name="close" size={24} color="#6b6b6b" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.cardForm} keyboardShouldPersistTaps="handled">
              <Field
                control={form.control}
                name="nombre"
                label="Nombre completo"
                autoCapitalize="words"
                placeholder="Juan Pérez"
                rules={reglaNombre}
              />
              <Field
                control={form.control}
                name="email"
                label="Correo"
                keyboardType="email-address"
                placeholder="nombre@correo.com"
                rules={reglaEmail}
              />
              <Field
                control={form.control}
                name="telefono"
                label={user?.telefono ? 'Teléfono' : 'Teléfono (opcional)'}
                keyboardType="phone-pad"
                placeholder="3001234567"
                rules={reglaTelefono}
              />

              {!!errorEnvio && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxText}>{errorEnvio}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.cardFooter}>
              <Button
                text="Cancelar"
                onPress={cerrar}
                secondary
                disabled={guardando}
                style={styles.footerBtn}
              />
              <Button
                text={guardando ? 'Guardando…' : 'Guardar cambios'}
                onPress={guardar}
                disabled={guardando}
                style={styles.footerBtn}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}