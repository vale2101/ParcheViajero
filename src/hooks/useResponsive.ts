import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { medirPantalla, type MedidaPantalla } from '../utils/responsive';

export function useResponsive(): MedidaPantalla {
  const { width, height } = useWindowDimensions();
  return useMemo(() => medirPantalla(width, height), [width, height]);
}
