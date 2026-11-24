import { Pressable, View } from 'react-native';
import LogoMarca from './LogoMarca';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';


export default function AdminSubHeader({ titulo, volverA }: { titulo: string; volverA: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.subHeader, { paddingTop: insets.top + 6 }]}
      accessibilityLabel={`Parche Viajero · ${titulo}`}>
      <Pressable
        style={styles.iconBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(volverA as never))}
        accessibilityRole="button"
        accessibilityLabel="Volver">
        <Ionicons name="arrow-back" size={24} color={colors.azul} />
      </Pressable>
      <LogoMarca style={styles.subHeaderLogo} />
      <View style={styles.subHeaderSpacer} />
    </View>
  );
}
