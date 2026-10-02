import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ value, onChange, readonly, size = 22 }: Props) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.row}>
      {stars.map((star) => {
        const filled = star <= value;
        const Star = (
          <Text style={[styles.star, { fontSize: size }, filled && styles.starFilled]}>
            {filled ? '★' : '☆'}
          </Text>
        );

        if (readonly) {
          return <View key={star}>{Star}</View>;
        }

        return (
          <Pressable key={star} onPress={() => onChange?.(star)} hitSlop={4}>
            {Star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  star: { color: '#E8D9B8' },
  starFilled: { color: '#FEBA03' },
});