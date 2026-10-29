import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { ImagenServicio } from '../api/servicio';
import FotoPlaceholder from './FotoPlaceholder';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';

interface Props {
  imagenes: ImagenServicio[];
  categoria?: string | undefined;
  indice?: number;
  onIndice?: (indice: number) => void;
}

const VISIBLES = 3;

export default function GaleriaServicio({ imagenes, categoria, indice = 0, onIndice }: Props) {
  const [ancho, setAncho] = useState(0);
  const lista = useRef<FlatList<ImagenServicio>>(null);
  const origen = useRef<'externo' | 'scroll'>('externo');
  const indiceSeguro = imagenes.length === 0 ? 0 : Math.min(Math.max(0, indice), imagenes.length - 1);
  const alto = ancho > 0 ? Math.min(400, Math.max(240, Math.round(ancho * 0.72))) : 260;

  function publicar(i: number) {
    const destino = Math.max(0, Math.min(imagenes.length - 1, i));
    origen.current = 'externo';
    onIndice?.(destino);
    lista.current?.scrollToIndex({ index: destino, animated: true });
  }

  function alScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!ancho) return;
    const siguiente = Math.max(0, Math.min(imagenes.length - 1, Math.round(e.nativeEvent.contentOffset.x / ancho)));
    if (siguiente === indiceSeguro) return;
    origen.current = 'scroll';
    onIndice?.(siguiente);
  }

  useEffect(() => {
    if (!ancho || imagenes.length === 0) return;
    if (origen.current === 'scroll') {
      origen.current = 'externo';
      return;
    }
    lista.current?.scrollToIndex({ index: indiceSeguro, animated: false });
  }, [ancho, imagenes.length, indiceSeguro]);

  if (imagenes.length === 0) {
    return (
      <View style={styles.galleryBleed}>
        <FotoPlaceholder categoria={categoria} style={styles.galleryPlaceholder} grande />
      </View>
    );
  }

  return (
    <View style={[styles.galleryBleed, { height: alto }]} onLayout={(e) => setAncho(e.nativeEvent.layout.width)}>
      {ancho > 0 && (
        <FlatList
          ref={lista}
          data={imagenes}
          keyExtractor={(i) => i._id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={alScroll}
          style={{ height: alto }}
          getItemLayout={(_, i) => ({ length: ancho, offset: ancho * i, index: i })}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => lista.current?.scrollToIndex({ index: info.index, animated: false }), 60);
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url_imagen }}
              style={{ width: ancho, height: alto }}
              contentFit="cover"
              cachePolicy="disk"
              transition={150}
              accessibilityLabel="Fotografía del servicio"
            />
          )}
        />
      )}

      <View style={styles.galleryCounter}>
        <Text style={styles.galleryCounterText}>
          {indiceSeguro + 1}/{imagenes.length}
        </Text>
      </View>

      {imagenes.length > 1 && imagenes.length <= 8 && (
        <View style={styles.dotsRow} pointerEvents="none">
          {imagenes.map((img, i) => (
            <View key={img._id} style={[styles.dot, i === indiceSeguro && styles.dotActive]} />
          ))}
        </View>
      )}

      {imagenes.length > 1 && indiceSeguro > 0 && (
        <Pressable
          style={[styles.galleryNav, { left: 12 }]}
          onPress={() => publicar(indiceSeguro - 1)}
          accessibilityRole="button"
          accessibilityLabel="Foto anterior">
          <Ionicons name="chevron-back" size={22} color={colors.azul} />
        </Pressable>
      )}
      {imagenes.length > 1 && indiceSeguro < imagenes.length - 1 && (
        <Pressable
          style={[styles.galleryNav, { right: 12 }]}
          onPress={() => publicar(indiceSeguro + 1)}
          accessibilityRole="button"
          accessibilityLabel="Foto siguiente">
          <Ionicons name="chevron-forward" size={22} color={colors.azul} />
        </Pressable>
      )}
    </View>
  );
}

export function TiraImagenes({
  imagenes,
  indice,
  onSelect,
}: {
  imagenes: ImagenServicio[];
  indice: number;
  onSelect: (indice: number) => void;
}) {
  const { width } = useWindowDimensions();
  if (imagenes.length <= 1) return null;

  const columna = Math.min(900, width) - 32;
  const lado = Math.max(72, Math.min(108, Math.floor((columna - 24) / VISIBLES)));
  const mostradas = imagenes.slice(0, VISIBLES);
  const extra = Math.max(0, imagenes.length - VISIBLES);

  return (
    <View style={styles.tira}>
      {mostradas.map((img, i) => {
        const cubierta = extra > 0 && i === mostradas.length - 1;
        const activo = cubierta ? indice >= i : indice === i;
        return (
          <Pressable
            key={img._id}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
            accessibilityLabel={cubierta ? `Ver más fotografías, ${extra} adicionales` : `Ver foto ${i + 1}`}
            style={[styles.thumbPrint, activo && styles.thumbPrintActive, { width: lado, height: lado }]}>
            <Image
              source={{ uri: img.url_imagen }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              cachePolicy="disk"
              accessibilityLabel={`Fotografía ${i + 1} de ${imagenes.length}`}
            />
            {cubierta && (
              <View style={styles.tiraOverlay}>
                <Text style={styles.tiraOverlayText}>+{extra}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
