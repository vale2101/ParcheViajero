import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCategoriaSticker } from '../utils/categoriaVisual';
import { styles } from '../styles/CategoriaSticker.styles';

interface Props {
  nombre?: string | null;
}

export default function CategoriaSticker({ nombre }: Props) {
  const texto = nombre?.trim();
  if (!texto) return null;

  const visual = getCategoriaSticker(texto);

  return (
    <View
      style={[styles.sticker, { backgroundColor: visual.fondo, borderColor: visual.borde }]}
      accessibilityRole="text"
      accessibilityLabel={`Categoría: ${texto}`}>
      <MaterialCommunityIcons name={visual.icono} size={14} color={visual.texto} />
      <Text style={[styles.texto, { color: visual.texto }]} numberOfLines={1} ellipsizeMode="tail">
        {texto}
      </Text>
    </View>
  );
}
