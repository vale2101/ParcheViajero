import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { styles } from '../styles/PickerField.styles';

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
