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
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { colors } from '../styles/theme';
import { styles } from '../styles/ServicioSwipeDeck.styles';
import Button from './Button';
import EmptyState from './EmptyState';
import FotoPlaceholder from './FotoPlaceholder';
import SectionTitle from './SectionTitle';
import StarRating from './StarRating';

const UMBRAL = 108;

interface Props {
  servicios: Servicio[];
  categoriaDe: (s: Servicio) => string | undefined;
  municipioDe?: (s: Servicio) => string | undefined;
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
  municipioDe,
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
  const tercero = servicios[2];

  const anchoCarta = Math.min(width - 48, 380);
  const altoCarta = Math.min(anchoCarta * 1.08, 400);
  const peek = 20;
  const altoMazo = altoCarta + peek * 2 + (mostrarAcciones ? 48 : 8);

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
      Animated.spring(x, {
        toValue: direccion === 'der' ? width * 1.35 : -width * 1.35,
        useNativeDriver: true,
        speed: 18,
        bounciness: 0,
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
        onMoveShouldSetPanResponder: (_, g) => !animando.current && Math.abs(g.dx) > 6,
        onPanResponderMove: (_, g) => x.setValue(g.dx),
        onPanResponderRelease: (_, g) => {
          if (!tope || animando.current) return;
          if (Math.abs(g.dx) < 8 && Math.abs(g.dy) < 8) {
            onAbrir(tope);
            return;
          }
          if (g.dx > UMBRAL || g.vx > 0.85) volar('der', tope);
          else if (g.dx < -UMBRAL || g.vx < -0.85) volar('izq', tope);
          else Animated.spring(x, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        },
      }),
    [onAbrir, tope, volar, x],
  );

  if (!tope) {
    return (
      <View style={{ gap: 12 }}>
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
    outputRange: ['-14deg', '0deg', '14deg'],
  });
  const opacidadSi = x.interpolate({
    inputRange: [18, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const opacidadNo = x.interpolate({
    inputRange: [-100, -18],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const escalaSi = x.interpolate({
    inputRange: [-80, 0, 140],
    outputRange: [0.9, 1, 1.16],
    extrapolate: 'clamp',
  });
  const escalaNo = x.interpolate({
    inputRange: [-140, 0, 80],
    outputRange: [1.16, 1, 0.9],
    extrapolate: 'clamp',
  });
  function datosDe(s: Servicio) {
    return {
      servicio: s,
      categoria: categoriaDe(s),
      municipio: municipioDe?.(s),
      promedio: promedioDe(s._id),
    };
  }

  return (
    <View style={styles.bloque}>
      <SectionTitle icono="sparkles" titulo="Descubre un parche" />
      <View style={[styles.mazo, { height: altoMazo, width: anchoCarta, alignSelf: 'center' }]}>
        {tercero && (
          <View
            pointerEvents="none"
            style={[
              styles.carta,
              {
                height: altoCarta,
                top: peek * 2,
                transform: [{ scale: 0.86 }],
                opacity: 0.5,
              },
            ]}>
            <Tarjeta {...datosDe(tercero)} />
          </View>
        )}

        {siguiente && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.carta,
              {
                height: altoCarta,
                top: peek,
                transform: [{ scale: 0.92 }],
                opacity: 0.78,
              },
            ]}>
            <Tarjeta {...datosDe(siguiente)} />
          </Animated.View>
        )}

        <Animated.View
          {...responder.panHandlers}
          style={[
            styles.carta,
            {
              height: altoCarta,
              top: 0,
              zIndex: 4,
              transform: [{ translateX: x }, { rotate: rotacion }],
            },
          ]}>
          <Tarjeta
            {...datosDe(tope)}
            selloPasar={mostrarAcciones ? opacidadNo : undefined}
            selloFavorito={mostrarAcciones ? opacidadSi : undefined}
          />
        </Animated.View>

        {mostrarAcciones && (
          <View style={styles.acciones}>
            <Animated.View style={{ transform: [{ scale: escalaNo }] }}>
              <Pressable
                onPress={() => volar('izq', tope)}
                accessibilityRole="button"
                accessibilityLabel="Pasar"
                style={[styles.boton, styles.botonX]}>
                <Animated.View
                  pointerEvents="none"
                  style={[styles.botonRelleno, { backgroundColor: colors.azulOscuro, opacity: opacidadNo }]}
                />
                <IconoAccion name="close" color={colors.azulOscuro} size={22} opacidad={opacidadNo} />
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={() => onAbrir(tope)}
              accessibilityRole="button"
              accessibilityLabel="Ver detalles"
              style={[styles.boton, styles.botonInfo]}>
              <Ionicons name="information" size={18} color={colors.azul} />
            </Pressable>

            <Animated.View style={{ transform: [{ scale: escalaSi }] }}>
              <Pressable
                onPress={() => volar('der', tope)}
                accessibilityRole="button"
                accessibilityLabel="Guardar en favoritos"
                style={[styles.boton, styles.botonHeart]}>
                <Animated.View
                  pointerEvents="none"
                  style={[styles.botonRelleno, { backgroundColor: colors.dorado, opacity: opacidadSi }]}
                />
                <IconoAccion
                  name={esFavorito(tope._id) ? 'heart' : 'heart'}
                  color={colors.doradoTexto}
                  size={24}
                  opacidad={opacidadSi}
                />
              </Pressable>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

function IconoAccion({
  name,
  color,
  size,
  opacidad,
}: {
  name: 'close' | 'heart';
  color: string;
  size: number;
  opacidad: Animated.AnimatedInterpolation<number>;
}) {
  const opacidadReposo = opacidad.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View>
      <Animated.View style={{ opacity: opacidadReposo }}>
        <Ionicons name={name} size={size} color={color} />
      </Animated.View>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: opacidad,
        }}>
        <Ionicons name={name} size={size} color="#fff" />
      </Animated.View>
    </View>
  );
}

function Tarjeta({
  servicio,
  categoria,
  municipio,
  promedio,
  selloPasar,
  selloFavorito,
}: {
  servicio: Servicio;
  categoria?: string;
  municipio?: string;
  promedio?: number;
  selloPasar?: Animated.AnimatedInterpolation<number>;
  selloFavorito?: Animated.AnimatedInterpolation<number>;
}) {
  const foto = servicio.imagenes?.[0]?.url_imagen;
  const visual = getCategoriaVisual(categoria);

  return (
    <View style={styles.tarjeta}>
      {foto ? (
        <Foto uri={foto} recyclingKey={servicio._id} style={styles.foto} priority="high" />
      ) : (
        <FotoPlaceholder plano categoria={categoria} style={styles.foto} grande />
      )}

      <View pointerEvents="none" style={styles.velo1} />
      <View pointerEvents="none" style={styles.velo2} />
      <View pointerEvents="none" style={styles.velo3} />

      {selloPasar && (
        <Animated.View pointerEvents="none" style={[styles.tinte, { backgroundColor: 'rgba(18, 59, 121, 0.12)', opacity: selloPasar }]} />
      )}
      {selloFavorito && (
        <Animated.View pointerEvents="none" style={[styles.tinte, { backgroundColor: 'rgba(233, 184, 91, 0.18)', opacity: selloFavorito }]} />
      )}

      {selloPasar && (
        <Animated.View style={[styles.sello, styles.selloPasar, { opacity: selloPasar }]}>
          <Text style={[styles.selloTexto, { color: colors.azulOscuro }]}>PASAR</Text>
        </Animated.View>
      )}
      {selloFavorito && (
        <Animated.View style={[styles.sello, styles.selloFavorito, { opacity: selloFavorito }]}>
          <Text style={[styles.selloTexto, { color: colors.doradoTexto }]}>FAVORITO</Text>
        </Animated.View>
      )}

      <View style={styles.info} pointerEvents="none">
        <View style={styles.nombreCaja}>
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
          ].map(([dx, dy]) => (
            <Text
              key={`${dx}${dy}`}
              style={[styles.nombreBorde, { transform: [{ translateX: dx }, { translateY: dy }] }]}
              numberOfLines={2}>
              {servicio.nombre}
            </Text>
          ))}
          <Text style={styles.nombre} numberOfLines={2}>
            {servicio.nombre}
          </Text>
        </View>
        {!!municipio && (
          <Text style={styles.lugar} numberOfLines={1}>
            {municipio}
          </Text>
        )}
        <View style={styles.meta}>
          {!!categoria && (
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>
                {visual.emoji} {categoria}
              </Text>
            </View>
          )}
          {promedio !== undefined && <StarRating value={Math.round(promedio)} readonly size={14} />}
          {servicio.precio !== undefined && (
            <Text style={styles.precio}>{formatearPrecioCOP(servicio.precio)}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
