import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';


export default function AdminSubHeader({ titulo, volverA }: { titulo: string; volverA: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.subHeader, { paddingTop: insets.top + 6 }]}>
      <Pressable
        style={styles.iconBtn}
        onPress={() => (router.canGoBack() ? router.back() : router.replace(volverA as never))}
        accessibilityRole="button"
        accessibilityLabel="Volver">
        <Ionicons name="arrow-back" size={24} color={colors.azul} />
      </Pressable>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.subHeaderLogo}
        resizeMode="contain"
        accessibilityLabel={`Parche Viajero · ${titulo}`}
      />
      <View style={styles.subHeaderSpacer} />
    </View>
  );
}
