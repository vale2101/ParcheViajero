import { useState } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from '../styles/Button.styles';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  outline?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ text, onPress, disabled, secondary, outline, style }: Props) {
  const [pressed, setPressed] = useState(false);
  const variante = outline ? styles.outline : secondary ? styles.secondary : styles.primary;
  const texto = outline ? styles.textOutline : secondary ? styles.textSecondary : styles.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
        styles.base,
        variante,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, texto]}>{text}</Text>
    </Pressable>
  );
}
