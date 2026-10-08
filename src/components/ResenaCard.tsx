import { Pressable, StyleSheet, Text, View } from 'react-native';
import StarRating from './StarRating';
import { fechaRelativa } from '../utils/fechas';
import type { Resena } from '../api/resena';

interface Props {
  resena: Resena;
  nombre?: string;
  esMia?: boolean;
  borrando?: boolean;
  onDelete?: () => void;
}

// Una reseña: avatar con inicial, nombre, fecha relativa, estrellas y comentario
export default function ResenaCard({ resena, nombre, esMia, borrando, onDelete }: Props) {
  const nombreMostrado = nombre ?? 'Viajero';

  return (
    <View style={[styles.card, esMia && styles.cardMia]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{nombreMostrado.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.nombre}>{nombreMostrado}</Text>
            {esMia && <Text style={styles.badge}>Tu reseña</Text>}
          </View>
          <Text style={styles.fecha}>{fechaRelativa(resena.fecha)}</Text>
        </View>

        <StarRating value={resena.calificacion} readonly size={16} />
      </View>

      {!!resena.comentario && <Text style={styles.comentario}>{resena.comentario}</Text>}

      {esMia && !!onDelete && (
        <Pressable onPress={onDelete} disabled={borrando} hitSlop={8}>
          <Text style={styles.deleteText}>{borrando ? 'Borrando…' : 'Eliminar'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 14,
    gap: 8,
  },
  cardMia: { borderColor: '#F5B700' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#F5B700' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nombre: { fontSize: 14, fontWeight: '600', color: '#1E3A8A', flexShrink: 1 },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E3A8A',
    backgroundColor: '#F5B700',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  fecha: { fontSize: 12, color: '#737373' },
  comentario: { fontSize: 14, color: '#171717', lineHeight: 20 },
  deleteText: { fontSize: 12, fontWeight: '600', color: '#dc2626' },
});
