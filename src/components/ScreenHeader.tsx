import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/ScreenHeader.styles';

interface Props {
  onPressMenu?: () => void;
}

export default function ScreenHeader({ onPressMenu }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Parche Viajero"
      />

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
