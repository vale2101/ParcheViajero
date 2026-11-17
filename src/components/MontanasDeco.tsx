import { View } from 'react-native';
import { colors } from '../styles/theme';

function Triangulo({ ancho, alto, color }: { ancho: number; alto: number; color: string }) {
  return (
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: ancho / 2,
        borderRightWidth: ancho / 2,
        borderBottomWidth: alto,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
    />
  );
}

export default function MontanasDeco() {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', right: 0, bottom: 0, width: 150, height: 100 }}>
      <View
        style={{
          position: 'absolute',
          right: 22,
          top: 8,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: colors.dorado,
          opacity: 0.75,
        }}
      />
      <View style={{ position: 'absolute', left: 6, bottom: 0, opacity: 0.55 }}>
        <Triangulo ancho={90} alto={52} color="#9DB8E6" />
      </View>
      <View style={{ position: 'absolute', right: 0, bottom: 0, opacity: 0.8 }}>
        <Triangulo ancho={110} alto={74} color="#5C86C9" />
      </View>
      <View style={{ position: 'absolute', right: 40, bottom: 52 }}>
        <Triangulo ancho={30} alto={22} color="#FFFBF1" />
      </View>
    </View>
  );
}
