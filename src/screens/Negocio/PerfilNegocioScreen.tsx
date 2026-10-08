import { Text, View } from 'react-native';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/NegocioPerfil.styles';

export default function PerfilNegocioScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.nombre}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <Button text="Cerrar sesión" onPress={logout} secondary style={styles.button} />
      </View>
    </View>
  );
}