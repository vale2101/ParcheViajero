import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFotoPerfil } from '../hooks/useFotoPerfil';
import { colors } from '../styles/theme';
import { styles } from '../styles/AvatarEditable.styles';

export default function AvatarEditable() {
  const { user } = useAuth();
  const { foto, cambiarFoto } = useFotoPerfil();
  const letra = user?.nombre?.trim()?.[0] || user?.email?.[0];
  const inicial = letra ? letra.toUpperCase() : '?';

  return (
    <Pressable onPress={cambiarFoto} style={styles.contenedor} accessibilityLabel="Cambiar foto de perfil">
      <View style={styles.anillo}>
        <View style={styles.avatar}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.imagen} />
          ) : (
            <Text style={styles.inicial}>{inicial}</Text>
          )}
        </View>
      </View>

      <View style={styles.camara}>
        <Ionicons name="camera" size={15} color={colors.dorado} />
      </View>
    </Pressable>
  );
}
