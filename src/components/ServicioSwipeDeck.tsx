import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Foto from './Foto';
import { prefetchFotos, urlsPortada } from '../utils/fotos';
import { Ionicons } from '@expo/vector-icons';
import type { Servicio } from '../api/servicio';
import { formatearPrecioCOP } from '../utils/formatoServicio';
import { colors, radius, sombra, spacing, typography } from '../styles/theme';
import Button from './Button';
import Chip from './Chip';
import EmptyState from './EmptyState';
import FotoPlaceholder from './FotoPlaceholder';
import StarRating from './StarRating';

const UMBRAL = 110;

interface Props {
  servicios: Servicio[];
  categoriaDe: (s: Servicio) => string | undefined;
  promedioDe: (id: string) => number | undefined;
  esFavorito: (id: string) => boolean;
  onLike: (s: Servicio) => void;
  onDescartar: (s: Servicio) => void;
  mostrarAcciones?: boolean;
  onAbrir: (s: Servicio) => void;
  onReiniciar: () => void;
  onExplorarMapa: () => void;
}

export default function ServicioSwipeDeck({
  servicios,
  categoriaDe,
  promedioDe,
  esFavorito,
  onLike,
  onDescartar,
  mostrarAcciones = true,
  onAbrir,
  onReiniciar,
  onExplorarMapa,
}: Props) {
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(0)).current;
  const animando = useRef(false);
  const tope = servicios[0];
  const siguiente = servicios[1];

  useEffect(() => {
    prefetchFotos(urlsPortada(servicios.slice(1, 3)), 2);
  }, [servicios]);

  const terminarVuelo = useCallback(
    (direccion: 'izq' | 'der', servicio: Servicio) => {
      x.setValue(0);
      animando.current = false;
      if (direccion === 'der') onLike(servicio);
      else onDescartar(servicio);
    },
    [onDescartar, onLike, x],
  );

  const volar = useCallback(
    (direccion: 'izq' | 'der', servicio: Servicio) => {
      if (animando.current) return;
      animando.current = true;
      Animated.timing(x, {
        toValue: direccion === 'der' ? width : -width,
        duration: 280,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) {
          animando.current = false;
          return;
        }
        terminarVuelo(direccion, servicio);
      });
    },
    [terminarVuelo, width, x],
  );

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !animando.current,
        onMoveShouldSetPanResponder: (_, g) => !animando.current && Math.abs(g.dx) > 8,
        onPanResponderMove: (_, g) => x.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          if (!tope || animando.current) return;
          if (Math.abs(g.dx) < 10 && Math.abs(g.dy) < 10) {
            onAbrir(tope);
            return;
          }
          if (g.dx > UMBRAL) volar('der', tope);
          else if (g.dx < -UMBRAL) volar('izq', tope);
          else Animated.spring(x, { toValue: 0, useNativeDriver: true, friction: 7 }).start();
        },
      }),
    [onAbrir, tope, volar, x],
  );

  if (!tope) {
    return (
      <View style={{ gap: spacing.md }}>
        <EmptyState
          icono="sparkles-outline"
          mensaje="Se acabaron las tarjetas. Vuelve a verlas o explora el mapa."
          accion="Volver a ver"
          onAccion={onReiniciar}
        />
        <Button text="Explorar en el mapa" onPress={onExplorarMapa} outline />
      </View>
    );
  }

  const rotacion = x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-8deg', '0deg', '8deg'],
  });
  const opacidadSi = x.interpolate({
    inputRange: [20, 110],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const opacidadNo = x.interpolate({
    inputRange: [-110, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const escalaSi = x.interpolate({
    inputRange: [-80, 0, 140],
    outputRange: [0.88, 1, 1.22],
    extrapolate: 'clamp',
  });
  const escalaNo = x.interpolate({
    inputRange: [-140, 0, 80],
    outputRange: [1.22, 1, 0.88],
    extrapolate: 'clamp',
  });
  const escalaFondo = x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [1, 0.94, 1],
  });

  return (
    <View style={{ height: 390, alignItems: 'center' }}>
      {siguiente && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: '92%',
            height: 330,
            transform: [{ scale: escalaFondo }],
            top: 14,
          }}>
          <Tarjeta
            servicio={siguiente}
            categoria={categoriaDe(siguiente)}
            promedio={promedioDe(siguiente._id)}
          />
        </Animated.View>
      )}

      <Animated.View
        {...responder.panHandlers}
        style={{
          position: 'absolute',
          width: '96%',
          height: 340,
          transform: [{ translateX: x }, { rotate: rotacion }],
        }}>
        <Tarjeta servicio={tope} categoria={categoriaDe(tope)} promedio={promedioDe(tope._id)} />
      </Animated.View>

      {mostrarAcciones && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            gap: spacing.xl,
          }}>
        <Animated.View style={{ transform: [{ scale: escalaNo }] }}>
          <Pressable
            onPress={() => volar('izq', tope)}
            accessibilityRole="button"
            accessibilityLabel="No me gusta"
            style={botonRedondo}>
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.rojo, borderRadius: 28, opacity: opacidadNo },
              ]}
            />
            <IconoAccion name="close" color={colors.rojo} opacidad={opacidadNo} />
          </Pressable>
        </Animated.View>
        <Animated.View style={{ transform: [{ scale: escalaSi }] }}>
          <Pressable
            onPress={() => volar('der', tope)}
            accessibilityRole="button"
            accessibilityLabel={esFavorito(tope._id) ? 'Me gusta' : 'Me gusta y guardar'}
            style={botonRedondo}>
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.verde, borderRadius: 28, opacity: opacidadSi },
              ]}
            />
            <IconoAccion
              name={esFavorito(tope._id) ? 'heart' : 'heart-outline'}
              color={colors.verde}
              opacidad={opacidadSi}
            />
          </Pressable>
        </Animated.View>
        </View>
      )}
    </View>
  );
}

const botonRedondo = {
  width: 56,
  height: 56,
  borderRadius: 28,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: colors.superficie,
  borderWidth: 1,
  borderColor: colors.borde,
  overflow: 'hidden' as const,
  ...sombra,
};

function IconoAccion({
  name,
  color,
  opacidad,
}: {
  name: 'close' | 'heart' | 'heart-outline';
  color: string;
  opacidad: Animated.AnimatedInterpolation<number>;
}) {
  const opacidadReposo = opacidad.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View>
      <Animated.View style={{ opacity: opacidadReposo }}>
        <Ionicons name={name} size={26} color={color} />
      </Animated.View>
      <Animated.View style={{ ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', opacity: opacidad }}>
        <Ionicons name={name} size={26} color="#fff" />
      </Animated.View>
    </View>
  );
}

function Tarjeta({
  servicio,
  categoria,
  promedio,
}: {
  servicio: Servicio;
  categoria?: string;
  promedio?: number;
}) {
  const foto = servicio.imagenes?.[0]?.url_imagen;

  return (
    <View
      style={{
        height: 330,
        borderRadius: radius.xl,
        overflow: 'hidden',
        backgroundColor: colors.superficie,
        borderWidth: 1,
        borderColor: colors.borde,
        ...sombra,
      }}>
      {foto ? (
        <Foto
          uri={foto}
          recyclingKey={servicio._id}
          style={{ width: '100%', height: 200 }}
          priority="high"
        />
      ) : (
        <FotoPlaceholder plano categoria={categoria} style={{ width: '100%', height: 200 }} />
      )}
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <Text style={typography.subtitulo} numberOfLines={1}>
          {servicio.nombre}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' }}>
          {!!categoria && <Chip label={categoria} />}
          {promedio !== undefined && <StarRating value={Math.round(promedio)} readonly size={14} />}
        </View>
        {servicio.precio !== undefined && (
          <Text style={[typography.cuerpo, { color: colors.azulOscuro, fontWeight: '700' }]}>
            {formatearPrecioCOP(servicio.precio)}
          </Text>
        )}
      </View>
    </View>
  );
}
