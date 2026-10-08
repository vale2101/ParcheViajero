import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  onResena: () => void;
  onRuta: () => void;
  errorRuta: string | null;
}

export default function AccionesLugar({ onResena, onRuta, errorRuta }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable
          onPress={onResena}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Dejar reseña</Text>
        </Pressable>
        <Pressable
          onPress={onRuta}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Cómo llegar</Text>
        </Pressable>
      </View>
      {errorRuta ? <Text style={styles.error}>{errorRuta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingBottom: 16, gap: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    padding: 14,
  },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#F5B700', fontSize: 14, fontWeight: '600' },
  error: { color: '#dc2626', fontSize: 12, textAlign: 'center' },
});
