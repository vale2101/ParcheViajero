import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

const LOGO = require('../../assets/logo-header.webp');
const CARGA = require('../../assets/logo-carga.png');

export function precargarLogos(): void {
  void Image.loadAsync(LOGO);
  void Image.loadAsync(CARGA);
}

export default function LogoMarca({
  style,
  carga = false,
}: {
  style?: StyleProp<ImageStyle>;
  carga?: boolean;
}) {
  return (
    <Image
      source={carga ? CARGA : LOGO}
      style={style}
      contentFit="contain"
      cachePolicy="memory"
      transition={0}
      priority="high"
      recyclingKey={carga ? 'logo-carga' : 'logo-header'}
      accessibilityLabel="Parche Viajero"
    />
  );
}
