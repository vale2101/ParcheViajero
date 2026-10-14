import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/ScreenHeader.styles';

interface Props {
  // Si se pasa, aparece el ícono de apagar arriba a la derecha
  onPressMenu?: () => void;
}

export default function ScreenHeader({ onPressMenu }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Parche Viajero</Text>

      {!!onPressMenu && (
        <Pressable
          onPress={onPressMenu}
          hitSlop={8}
          accessibilityLabel="Abrir menú"
          style={[styles.menuButton, { top: insets.top + 10 }]}>
          <Ionicons name="power-outline" size={24} color="#1E3A8A" />
        </Pressable>
      )}
    </View>
  );
}