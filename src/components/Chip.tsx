import { Pressable, Text, View } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export default function Chip({ label, active, onPress }: Props) {
  const estilo = {
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: active ? colors.azulOscuro : colors.borde,
    backgroundColor: active ? colors.azulOscuro : colors.superficie,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  };
  const etiqueta = (
    <Text
      style={{
        fontSize: 13,
        fontWeight: '700',
        color: active ? colors.dorado : colors.azulOscuro,
      }}>
      {label}
    </Text>
  );

  if (!onPress) {
    return <View style={estilo}>{etiqueta}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={estilo}>
      {etiqueta}
    </Pressable>
  );
}
