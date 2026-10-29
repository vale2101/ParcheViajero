import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../styles/theme';

const sombraPolaroid = {
  shadowColor: '#5B4A1F',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.18,
  shadowRadius: 5,
  elevation: 4,
} as const;

interface Props {
  children: ReactNode;
  ancho: number;
  alto: number;
  rotacion?: string;
  activo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function MarcoPolaroid({ children, ancho, alto, rotacion = '-7deg', activo, style }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFEFB',
          paddingTop: 5,
          paddingHorizontal: 5,
          paddingBottom: 13,
          borderRadius: 5,
          borderWidth: activo ? 2 : 0,
          borderColor: colors.dorado,
          transform: [{ rotate: rotacion }],
          ...sombraPolaroid,
        },
        style,
      ]}>
      <View style={{ width: ancho, height: alto, borderRadius: 2, overflow: 'hidden', backgroundColor: colors.beige }}>
        {children}
      </View>
    </View>
  );
}
