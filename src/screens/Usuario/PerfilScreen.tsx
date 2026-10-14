import { ScrollView, Text, View } from 'react-native';
import AvatarEditable from '../../components/AvatarEditable';
import Button from '../../components/Button';
import FavoritosSection from '../../components/FavoritosSection';
import MisResenasSection from '../../components/MisResenasSection';
import ResenasSection from '../../components/ResenasSection';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/UsuarioPerfil.styles';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <AvatarEditable />
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
