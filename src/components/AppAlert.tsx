import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import Loader from './Loader';
import { styles } from '../styles/AppAlert.styles';

export type TipoAlerta = 'error' | 'exito' | 'confirm';

interface Props {
  visible: boolean;
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  confirmarTexto: string;
  cancelarTexto: string;
  tono: 'peligro' | 'exito';
  cargando: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ICONOS: Record<
  TipoAlerta,
  { name: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  error: { name: 'close-circle', color: '#dc2626', bg: '#FDE8E8' },
  exito: { name: 'checkmark-circle', color: '#047857', bg: '#E3F4EC' },
  confirm: { name: 'warning', color: '#B45309', bg: '#FEF3C7' },
};

export default function AppAlert({
  visible,
  tipo,
  titulo,
  mensaje,
  confirmarTexto,
  cancelarTexto,
  tono,
  cargando,
  onClose,
  onConfirm,
}: Props) {
  const icono =
    tipo === 'confirm' && tono === 'exito'
      ? { name: 'checkmark-circle' as const, color: '#047857', bg: '#E3F4EC' }
      : ICONOS[tipo];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={cargando ? undefined : onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: icono.bg }]}>
            <Ionicons name={icono.name} size={36} color={icono.color} />
          </View>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.text}>{mensaje}</Text>

          {tipo === 'confirm' ? (
            <View style={styles.actions}>
              <Button
                text={cancelarTexto}
                onPress={onClose}
                secondary
                disabled={cargando}
                style={styles.actionBtn}
              />
              <Pressable
                style={[
                  styles.confirmBtn,
                  tono === 'exito' ? styles.confirmExito : styles.confirmPeligro,
                  cargando && { opacity: 0.6 },
                ]}
                onPress={onConfirm}
                disabled={cargando}
                accessibilityRole="button">
                {cargando ? (
                  <Loader tipo="boton" color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>{confirmarTexto}</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <Button text="Entendido" onPress={onClose} style={{ width: '100%', marginTop: 8 }} />
          )}
        </View>
      </View>
    </Modal>
  );
}
