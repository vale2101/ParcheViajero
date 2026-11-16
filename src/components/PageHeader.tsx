import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

interface Props {
  titulo: string;
  subtitulo?: string;
  derecha?: ReactNode;
  onPressDerecha?: () => void;
  etiquetaDerecha?: string;
}

export default function PageHeader({
  titulo,
  subtitulo,
  derecha,
  onPressDerecha,
  etiquetaDerecha,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
      }}>
      <View style={{ flex: 1 }}>
        <Text style={typography.titulo}>{titulo}</Text>
        {!!subtitulo && (
          <Text style={[typography.cuerpo, { color: colors.textoSec, marginTop: spacing.xs }]}>
            {subtitulo}
          </Text>
        )}
      </View>
      {derecha}
      {!!onPressDerecha && !!etiquetaDerecha && (
        <Pressable onPress={onPressDerecha} hitSlop={8} accessibilityRole="button">
          <Text style={[typography.subtitulo, { color: colors.azul, fontSize: 14 }]}>
            {etiquetaDerecha}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
