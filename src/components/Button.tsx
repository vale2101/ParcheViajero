import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ text, onPress, disabled, secondary, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, secondary ? styles.textSecondary : styles.textPrimary]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
  },
  primary: {
    backgroundColor: '#0147B9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  secondary: {
    backgroundColor: '#FAF4E4', 
    borderWidth: 2,
    borderColor: '#FEBA03', 
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#FEBA03', 
  },
  textSecondary: {
    color: '#0147B9', 
  },
});