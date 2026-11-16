import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { colors, radius, sombra, spacing, typography } from '../styles/theme';
import MontanasDeco from './MontanasDeco';

interface Props {
  titulo: string;
  subtitulo: string;
  izquierda?: ReactNode;
}

export default function TarjetaSaludo({ titulo, subtitulo, izquierda }: Props) {
  return (
    <View
      style={{
        borderRadius: radius.lg,
        backgroundColor: colors.superficie,
        borderWidth: 1,
        borderColor: colors.borde,
        padding: spacing.lg,
        overflow: 'hidden',
        minHeight: 110,
        justifyContent: 'center',
        ...sombra,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, maxWidth: '72%' }}>
        {izquierda}
        <View style={{ flex: 1 }}>
          <Text style={typography.titulo}>{titulo}</Text>
          <Text style={[typography.cuerpo, { color: colors.textoSec, marginTop: 4 }]}>
            {subtitulo}
          </Text>
        </View>
      </View>
      <MontanasDeco />
    </View>
  );
}
