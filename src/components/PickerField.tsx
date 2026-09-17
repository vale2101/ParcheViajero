import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export interface PickerOption {
  id: string;
  nombre: string;
}

interface Props {
  label: string;
  value: string | null;
  options: PickerOption[];
  onChange: (id: string) => void;
  placeholder?: string;
  error?: string;
}

export default function PickerField({ label, value, options, onChange, placeholder, error }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[styles.input, error ? styles.inputError : styles.inputIdle]}
        onPress={() => setOpen(true)}>
        <Text style={selected ? styles.valueText : styles.placeholderText}>
          {selected ? selected.nombre : placeholder ?? 'Selecciona una opción'}
        </Text>
      </Pressable>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}>
                  <Text
                    style={[styles.optionText, item.id === value && styles.optionTextActive]}>
                    {item.nombre}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#0147B9' },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FAF4E4',
    padding: 14,
    justifyContent: 'center',
  },
  inputIdle: { borderColor: '#E8D9B8' },
  inputError: { borderColor: '#ef4444' },
  valueText: { fontSize: 16, color: '#171717' },
  placeholderText: { fontSize: 16, color: '#a3a3a3' },
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FAF4E4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0147B9',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9B8',
  },
  optionText: { fontSize: 15, color: '#171717' },
  optionTextActive: { color: '#0147B9', fontWeight: '700' },
});