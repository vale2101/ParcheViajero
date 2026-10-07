import { ScrollView, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import FavoritosSection from '../../src/components/FavoritosSection';
import MisResenasSection from '../../src/components/MisResenasSection';
import ResenasSection from '../../src/components/ResenasSection';
import ScreenHeader from '../../src/components/ScreenHeader';
import { useAuth } from '../../src/context/AuthContext';
import { styles } from '../../src/styles/UsuarioPerfil.styles';

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
