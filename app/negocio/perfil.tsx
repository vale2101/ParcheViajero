import { Text, View } from 'react-native';
import Button from '../../src/components/Button';
import ScreenHeader from '../../src/components/ScreenHeader';
import { useAuth } from '../../src/context/AuthContext';
import { styles } from '../../src/styles/NegocioPerfil.styles';

export default function Perfil() {
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
