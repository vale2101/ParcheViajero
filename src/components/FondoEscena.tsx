import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

export default function FondoEscena({ children }: { children: ReactNode }) {
  return (
    <ImageBackground
      source={require('../../assets/fotofondo.jpg')}
      style={styles.caja}
      imageStyle={styles.foto}
      resizeMode="cover">
      <View style={styles.velo}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  caja: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF8E9',
  },
  foto: {
    opacity: 0.42,
  },
  velo: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 233, 0.55)',
  },
});
