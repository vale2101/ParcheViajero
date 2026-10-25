import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Loader.styles';

type TipoLoader = 'pantalla' | 'bloque' | 'compacto' | 'boton';

interface Props {
  tipo?: TipoLoader;
  texto?: string;
  color?: string;
}

const MEDIDAS = {
  pantalla: { caja: 88, anillo: 88, grosor: 4, icono: 36 },
  bloque: { caja: 76, anillo: 76, grosor: 4, icono: 32 },
  compacto: { caja: 28, anillo: 28, grosor: 3, icono: 14 },
  boton: { caja: 22, anillo: 22, grosor: 2.5, icono: 12 },
} as const;

function Anillo({
  tipo,
  color,
}: {
  tipo: TipoLoader;
  color?: string;
}) {
  const giro = useRef(new Animated.Value(0)).current;
  const m = MEDIDAS[tipo];
  const anilloBase = color ? 'rgba(255,255,255,0.35)' : '#0147B9';
  const anilloTope = color ?? '#FEBA03';

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(giro, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [giro]);

  const rotate = giro.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.anilloCaja, { width: m.caja, height: m.caja }]}>
      <Animated.View
        style={[
          styles.anillo,
          {
            width: m.anillo,
            height: m.anillo,
            borderRadius: m.anillo / 2,
            borderWidth: m.grosor,
            borderColor: anilloBase,
            borderTopColor: anilloTope,
            transform: [{ rotate }],
          },
        ]}
      />
      {tipo === 'boton' ? null : (
        <View
          style={[
            styles.nucleo,
            {
              width: m.caja - m.grosor * 6,
              height: m.caja - m.grosor * 6,
              borderRadius: (m.caja - m.grosor * 6) / 2,
            },
          ]}>
          {tipo === 'pantalla' || tipo === 'bloque' ? (
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Parche Viajero"
            />
          ) : (
            <Ionicons name="compass" size={m.icono} color="#0147B9" />
          )}
        </View>
      )}
    </View>
  );
}

export default function Loader({ tipo = 'bloque', texto, color }: Props) {
  if (tipo === 'boton') {
    return <Anillo tipo="boton" color={color} />;
  }

  if (tipo === 'compacto') {
    return (
      <View style={styles.compacto} accessibilityLabel={texto ?? 'Cargando'}>
        <Anillo tipo="compacto" />
        {!!texto && <Text style={styles.textoCompacto}>{texto}</Text>}
      </View>
    );
  }

  if (tipo === 'pantalla') {
    return (
      <View style={styles.pantalla} accessibilityLabel={texto ?? 'Cargando'}>
        <Anillo tipo="pantalla" />
        <Text style={styles.marca}>Parche Viajero</Text>
        {!!texto && <Text style={styles.texto}>{texto}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.bloque} accessibilityLabel={texto ?? 'Cargando'}>
      <Anillo tipo="bloque" />
      <Text style={styles.marca}>Parche Viajero</Text>
      {!!texto && <Text style={styles.texto}>{texto}</Text>}
    </View>
  );
}
