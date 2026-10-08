import { ScrollView, StyleSheet, View } from 'react-native';
import FavoritosSection from '../components/FavoritosSection';
import MisResenasSection from '../components/MisResenasSection';
import ProfileHeader from '../components/ProfileHeader';
import ResenasSection from '../components/ResenasSection';
import ScreenHeader from '../components/ScreenHeader';

export default function PerfilUsuarioScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader />
        <FavoritosSection />
        <MisResenasSection />
        <ResenasSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { padding: 24, gap: 28 },
});
