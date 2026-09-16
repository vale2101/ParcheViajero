import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import FavoritosSection from '../../src/components/FavoritosSection';
import MisResenasSection from '../../src/components/MisResenasSection';
import ResenasSection from '../../src/components/ResenasSection';
import ScreenHeader from '../../src/components/ScreenHeader';
import { useAuth } from '../../src/context/AuthContext';

export default function Perfil() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.nombre}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <Button text="Cerrar sesión" onPress={logout} secondary style={styles.button} />
        </View>

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
  profileHeader: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: '#1E3A8A',
    marginBottom: 8,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#F5B700' },
  name: { fontSize: 18, fontWeight: '600', color: '#1E3A8A' },
  email: { color: '#a3a3a3', marginBottom: 8 },
  button: { width: '100%', marginTop: 8 },
});