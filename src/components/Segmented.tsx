import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles/Admin.styles';

interface Props<T extends string> {
  valor: T;
  opciones: { valor: T; etiqueta: string }[];
  onChange: (v: T) => void;
}

export default function Segmented<T extends string>({ valor, opciones, onChange }: Props<T>) {
  return (
    <View style={styles.segmented}>
      {opciones.map((o) => {
        const activo = o.valor === valor;
        return (
          <Pressable
            key={o.valor}
            style={[styles.segOption, activo && styles.segActive]}
            onPress={() => onChange(o.valor)}
            accessibilityRole="button"
            accessibilityState={{ selected: activo }}>
            <Text style={[styles.segText, activo && styles.segTextActive]} numberOfLines={1}>
              {o.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}