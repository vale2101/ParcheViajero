import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { getCategoriaVisual } from '../utils/categoriaVisual';

interface Props {
  categoria?: string | undefined;
  style?: StyleProp<ViewStyle>;
  grande?: boolean;
}

export default function FotoPlaceholder({ categoria, style, grande }: Props) {
  const v = getCategoriaVisual(categoria);
  return (
    <View
      style={[
        {
          backgroundColor: `${v.color}1A`,
          borderWidth: 1,
          borderColor: '#E8D4AE',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
        },
        style,
      ]}
      accessibilityLabel="Imagen predeterminada del servicio">
      <Text style={{ fontSize: grande ? 56 : 32 }}>{v.emoji}</Text>
      {grande && (
        <Text style={{ fontSize: 12, color: '#5F6F8A', marginTop: 4 }}>Sin fotografías registradas</Text>
      )}
    </View>
  );
}
