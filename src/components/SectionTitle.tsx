import { Pressable, Text, View } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

interface Props {
  titulo: string;
  verTodo?: string;
  onVerTodo?: () => void;
}

export default function SectionTitle({ titulo, verTodo = 'Ver todo', onVerTodo }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
      }}>
      <Text style={typography.subtitulo}>{titulo}</Text>
      {!!onVerTodo && (
        <Pressable onPress={onVerTodo} hitSlop={8} accessibilityRole="button">
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.azul }}>{verTodo}</Text>
        </Pressable>
      )}
    </View>
  );
}
