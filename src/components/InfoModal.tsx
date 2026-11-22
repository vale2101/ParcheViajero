import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles as modalStyles } from '../styles/InfoModal.styles';

interface Props {
  visible: boolean;
  titulo: string;
  texto: string;
  onClose: () => void;
}

export default function InfoModal({ visible, titulo, texto, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [mostrar, setMostrar] = useState(visible);
  const opacidad = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      setMostrar(true);
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(escala, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(escala, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      ]).start(() => setMostrar(false));
    }
  }, [visible, opacidad, escala]);

  return (
    <Modal visible={mostrar} animationType="none" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <Animated.View style={[modalStyles.backdrop, { opacity: opacidad }]} />
      </Pressable>

      <Animated.View
        style={[
          modalStyles.container,
          {
            transform: [{ scale: escala }],
            marginTop: insets.top + 50,
          },
        ]}>
        <View style={modalStyles.content}>
          <Text style={modalStyles.title}>{titulo}</Text>
          <Text style={modalStyles.text}>{texto}</Text>
        </View>

        <Pressable style={modalStyles.closeButton} onPress={onClose}>
          <Text style={modalStyles.closeText}>Cerrar</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}