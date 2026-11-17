import { Modal, Text, View } from 'react-native';
import Button from './Button';
import { styles } from '../styles/InfoModal.styles';

interface Props {
  visible: boolean;
  titulo: string;
  texto: string;
  onClose: () => void;
}

// Ventanita sencilla con un título, un texto y un botón para cerrar
export default function InfoModal({ visible, titulo, texto, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{titulo}</Text>
          <Text style={styles.text}>{texto}</Text>
          <Button text="Entendido" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
