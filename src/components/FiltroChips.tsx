import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Opcion<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  opciones: Opcion<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

// Botones redondos para escoger una opción (orden, filtro o lugar)
export default function FiltroChips<T extends string>({ opciones, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {opciones.map((op) => {
        const activo = op.value === value;
        return (
          <Pressable
            key={op.value}
            onPress={() => onChange(op.value)}
            style={[styles.chip, activo && styles.chipActivo]}>
            <Text style={[styles.text, activo && styles.textActivo]}>{op.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
  },
  chipActivo: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  text: { fontSize: 13, fontWeight: '600', color: '#1E3A8A' },
  textActivo: { color: '#F5B700' },
});
