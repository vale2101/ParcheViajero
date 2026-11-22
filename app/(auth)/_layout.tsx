import { Slot } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image as Fondo } from 'expo-image';

export default function AuthLayout() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.fondo, { width, minHeight: height, backgroundColor: '#E8D4AE' }]}>
      <Fondo
        source={require('../../assets/fotofondo.jpg')}
        style={[styles.fotoFondo, { width, height }]}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={0}
        priority="high"
      />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
  },
  fotoFondo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
