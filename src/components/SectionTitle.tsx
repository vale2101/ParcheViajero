import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';

interface Props {
  titulo: string;
  icono?: keyof typeof Ionicons.glyphMap;
  verTodo?: string;
  onVerTodo?: () => void;
}

export default function SectionTitle({ titulo, icono, verTodo = 'Ver todo', onVerTodo }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
        gap: spacing.md,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
        {!!icono && (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: colors.doradoSuave,
              borderWidth: 1,
              borderColor: colors.dorado,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name={icono} size={15} color={colors.doradoTexto} />
          </View>
        )}
        <Text style={typography.subtitulo}>{titulo}</Text>
      </View>
      {!!onVerTodo && (
        <Pressable onPress={onVerTodo} hitSlop={8} accessibilityRole="button">
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.azul }}>{verTodo}</Text>
        </Pressable>
      )}
    </View>
  );
}
