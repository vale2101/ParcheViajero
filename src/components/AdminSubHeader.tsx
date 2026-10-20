import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
        <Ionicons name="arrow-back" size={24} color="#0147B9" />
      </Pressable>
      <Text style={styles.subHeaderTitle} numberOfLines={1}>
        {titulo}
      </Text>
    </View>
  );
}