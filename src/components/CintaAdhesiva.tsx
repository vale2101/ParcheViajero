import { View, type StyleProp, type ViewStyle } from 'react-native';

interface Props {
  ancho?: number;
  alto?: number;
  rotacion?: string;
  style?: StyleProp<ViewStyle>;
}

export default function CintaAdhesiva({
  ancho = 46,
  alto = 16,
  rotacion = '-8deg',
  style,
}: Props) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          position: 'absolute',
          top: -5,
          left: '50%',
          marginLeft: -ancho / 2,
          width: ancho,
          height: alto,
          borderRadius: 2,
          backgroundColor: 'rgba(232, 214, 176, 0.94)',
          borderWidth: 1,
          borderColor: 'rgba(176, 148, 96, 0.38)',
          transform: [{ rotate: rotacion }],
          zIndex: 4,
          overflow: 'hidden',
        },
        style,
      ]}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: alto * 0.42,
          backgroundColor: 'rgba(255, 251, 241, 0.42)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: ancho * 0.3,
          width: 5,
          backgroundColor: 'rgba(255, 251, 241, 0.2)',
        }}
      />
    </View>
  );
}
