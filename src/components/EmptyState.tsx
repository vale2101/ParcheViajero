import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';
import Button from './Button';

interface Props {
  icono?: keyof typeof Ionicons.glyphMap;
  mensaje: string;
  accion?: string;
  onAccion?: () => void;
}

export default function EmptyState({
  icono = 'trail-sign-outline',
  mensaje,
  accion,
  onAccion,
}: Props) {
  return (
    <View style={{ alignItems: 'center', gap: spacing.md, padding: spacing.xl }}>
      <Ionicons name={icono} size={40} color={colors.azul} />
      <Text style={[typography.cuerpo, { textAlign: 'center', color: colors.textoSec }]}>
        {mensaje}
      </Text>
      {!!accion && !!onAccion && <Button text={accion} onPress={onAccion} secondary />}
    </View>
  );
}
