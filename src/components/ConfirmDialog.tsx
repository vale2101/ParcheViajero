import { Modal, Pressable, Text, View } from 'react-native';
import Button from '../components/Button';
import Loader from './Loader';
import { styles } from '../styles/PerfilNegocio.styles';

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  confirmarTexto: string;
  cargando: boolean;
  error: string | null;
  tono?: 'peligro' | 'exito';
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  visible,
  titulo,
  mensaje,
  confirmarTexto,
  cargando,
  error,
  tono = 'peligro',
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={cargando ? undefined : onCancel}>
      <View style={styles.backdropCenter}>
        <View style={styles.cardCenter}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{titulo}</Text>
          </View>

          <View style={styles.confirmBody}>
            <Text style={styles.confirmText}>{mensaje}</Text>
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>{error}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <Button
              text="Cancelar"
              onPress={onCancel}
              secondary
              disabled={cargando}
              style={styles.footerBtn}
            />
            <Pressable
              style={[
                styles.confirmDanger,
                tono === 'exito' && { backgroundColor: '#047857' },
                cargando && { opacity: 0.6 },
              ]}
              onPress={onConfirm}
              disabled={cargando}
              accessibilityRole="button">
              {cargando ? (
                <Loader tipo="boton" color="#fff" />
              ) : (
                <Text style={styles.confirmDangerText}>{confirmarTexto}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}