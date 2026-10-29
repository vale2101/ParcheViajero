import { useWindowDimensions, View } from 'react-native';
import { styles } from '../styles/Admin.styles';

export default function DecoRutaCinta() {
  const { width } = useWindowDimensions();
  const compacta = width < 360;
  const puntos = compacta ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5, 6];

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.rutaCinta, compacta && styles.rutaCintaCompacta]}>
      {puntos.map((i) => (
        <View
          key={i}
          style={[
            styles.rutaPunto,
            {
              left: 2 + i * (compacta ? 9 : 11),
              top: 18 - Math.round(Math.sin(i / 2.1) * (compacta ? 7 : 9)),
            },
          ]}
        />
      ))}
      <View style={styles.cinta}>
        <View style={styles.cintaBrillo} />
        <View style={styles.cintaFibra} />
      </View>
    </View>
  );
}
