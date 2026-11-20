import { useEffect, useRef, type ReactNode } from 'react';
import { Animated } from 'react-native';

export default function EntradaPantalla({ children }: { children: ReactNode }) {
  const opacidad = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacidad, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [opacidad]);

  return (
    <Animated.View style={{ flex: 1, opacity: opacidad }}>
      {children}
    </Animated.View>
  );
}
