import { useRef, useState } from 'react';
import { FlatList, Pressable, View, type NativeScrollEvent, type NativeSyntheticEvent, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { ImagenServicio } from '../api/servicio';
import FotoPlaceholder from './FotoPlaceholder';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';

interface Props {
  imagenes: ImagenServicio[];
  categoria?: string | undefined;
}

// Galería con las fotografías originales del backend (sin filtros ni transformaciones).
export default function GaleriaServicio({ imagenes, categoria }: Props) {
  const [ancho, setAncho] = useState(0);
  const [indice, setIndice] = useState(0);
  const lista = useRef<FlatList<ImagenServicio>>(null);

  if (imagenes.length === 0) {
    return <FotoPlaceholder categoria={categoria} style={styles.detailPhoto} grande />;
  }

  function ir(i: number) {
    const destino = Math.max(0, Math.min(imagenes.length - 1, i));
    setIndice(destino);
    lista.current?.scrollToIndex({ index: destino, animated: true });
  }

  function alScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!ancho) return;
    setIndice(Math.round(e.nativeEvent.contentOffset.x / ancho));
  }

  return (
    <View style={styles.gallery}>
      <View style={styles.galleryMain} onLayout={(e) => setAncho(e.nativeEvent.layout.width)}>
        {ancho > 0 && (
          <FlatList
            ref={lista}
            data={imagenes}
            keyExtractor={(i) => i._id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={alScroll}
            getItemLayout={(_, i) => ({ length: ancho, offset: ancho * i, index: i })}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.url_imagen }}
                style={{ width: ancho, height: '100%' }}
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
            {indice + 1}/{imagenes.length}
          </Text>
        </View>

        {imagenes.length > 1 && indice > 0 && (
          <Pressable
            style={[styles.galleryNav, { left: 8 }]}
            onPress={() => ir(indice - 1)}
            accessibilityRole="button"
            accessibilityLabel="Foto anterior">
            <Ionicons name="chevron-back" size={22} color={colors.azul} />
          </Pressable>
        )}
        {imagenes.length > 1 && indice < imagenes.length - 1 && (
          <Pressable
            style={[styles.galleryNav, { right: 8 }]}
            onPress={() => ir(indice + 1)}
            accessibilityRole="button"
            accessibilityLabel="Foto siguiente">
            <Ionicons name="chevron-forward" size={22} color={colors.azul} />
          </Pressable>
        )}
      </View>

      {imagenes.length > 1 && (
        <View style={styles.galleryThumbs}>
          {imagenes.map((img, i) => (
            <Pressable
              key={img._id}
              onPress={() => ir(i)}
              style={[styles.galleryThumb, i === indice && styles.galleryThumbActive]}
              accessibilityRole="button"
              accessibilityLabel={`Ver foto ${i + 1}`}>
              <Image source={{ uri: img.url_imagen }} style={{ width: '100%', height: '100%' }} contentFit="cover" cachePolicy="disk" />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
