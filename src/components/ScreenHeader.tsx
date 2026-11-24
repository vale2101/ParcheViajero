import { Ionicons } from '@expo/vector-icons';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoMarca from './LogoMarca';
import { styles } from '../styles/ScreenHeader.styles';

interface Props {
  onPressMenu?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenHeader({ onPressMenu, style }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }, style]}>
      <LogoMarca style={styles.logo} />

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
