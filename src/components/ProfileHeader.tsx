import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

// Avatar, nombre, correo y botón de cerrar sesión (usuario y negocio)
export default function ProfileHeader() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user?.email.charAt(0).toUpperCase() ?? '?'}</Text>
      </View>
      <Text style={styles.name}>{user?.nombre}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Button text="Cerrar sesión" onPress={logout} secondary style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 8, width: '100%' },
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
