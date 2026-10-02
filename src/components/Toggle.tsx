import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: [ToggleOption<T>, ToggleOption<T>];
}

export default function Toggle<T extends string>({ value, onChange, options }: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, active && styles.optionActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FAF4E4',
  },
  optionActive: {
    backgroundColor: '#0147B9',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0147B9',
  },
  textActive: {
    color: '#FEBA03',
  },
});