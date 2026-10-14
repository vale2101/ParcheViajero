import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFotoPerfil } from '../hooks/useFotoPerfil';
import { styles } from '../styles/AvatarEditable.styles';

export default function AvatarEditable() {
  const { user } = useAuth();
  const { foto, cambiarFoto } = useFotoPerfil();

  return (
    <Pressable onPress={cambiarFoto} style={styles.contenedor}>
      <View style={styles.avatar}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.imagen} />
        ) : (
          <Text style={styles.inicial}>{user?.email.charAt(0).toUpperCase() ?? '?'}</Text>
        )}
      </View>

      {/* Iconito de cámara para que se vea que se puede editar */}
      <View style={styles.camara}>
        <Ionicons name="camera" size={14} color="#F5B700" />
      </View>
    </Pressable>
  );
}
