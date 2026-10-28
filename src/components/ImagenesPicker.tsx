import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { MAX_IMAGENES } from '../utils/seleccionarImagenes';

export interface FotoItem {
  key: string;
  uri: string;
}

interface Props {
  fotos: FotoItem[];
  ocupado?: boolean;
  aviso?: string | null;
  onAgregar: () => void;
  onQuitar: (key: string) => void;
}

export default function ImagenesPicker({ fotos, ocupado, aviso, onAgregar, onQuitar }: Props) {
  const lleno = fotos.length >= MAX_IMAGENES;

  return (
    <View style={s.box}>
      <View style={s.grid}>
        {fotos.map((f) => (
          <View key={f.key} style={s.thumbWrap}>
            <Image
              source={{ uri: f.uri }}
              style={s.thumb}
              contentFit="cover"
              cachePolicy="disk"
              transition={150}
            />
            <Pressable
              style={s.remove}
              onPress={() => onQuitar(f.key)}
              disabled={ocupado}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="Quitar imagen">
              <Ionicons name="close" size={16} color="#fff" />
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        style={[s.add, (lleno || ocupado) && { opacity: 0.5 }]}
        onPress={onAgregar}
        disabled={lleno || ocupado}
        accessibilityRole="button">
        {ocupado ? (
          <ActivityIndicator color="#0147B9" />
        ) : (
          <Ionicons name="images-outline" size={20} color="#0147B9" />
        )}
        <Text style={s.addText}>
          {ocupado ? 'Procesando…' : `Agregar fotos (${fotos.length}/${MAX_IMAGENES})`}
        </Text>
      </Pressable>

      {!!aviso && <Text style={s.aviso}>{aviso}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  box: { gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: { width: 96, height: 96 },
  thumb: { width: 96, height: 96, borderRadius: 12 },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#0147B9',
    backgroundColor: '#FAF4E4',
  },
  addText: { fontSize: 15, fontWeight: '600', color: '#0147B9' },
  aviso: { fontSize: 12, color: '#B45309' },
});