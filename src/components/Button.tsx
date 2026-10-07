import { useState } from 'react';
import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from '../styles/Button.styles';

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ text, onPress, disabled, secondary, style }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
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
