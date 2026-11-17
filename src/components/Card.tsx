import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, sombra, spacing } from '../styles/theme';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
}

export default function Card({ children, style, padding = spacing.lg }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.superficie,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.borde,
          padding,
          ...sombra,
        },
        style,
      ]}>
      {children}
    </View>
  );
}
