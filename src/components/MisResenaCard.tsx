import { Pressable, StyleSheet, Text, View } from 'react-native';
import StarRating from './StarRating';
import type { Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';

interface Props {
  resena: Resena;
  servicio?: Servicio;
  borrando: boolean;
  onDelete: () => void;
}

// Tarjeta de una reseña propia, con botón para eliminarla
export default function MisResenaCard({ resena, servicio, borrando, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.servicioNombre}>{servicio?.nombre ?? 'Servicio eliminado'}</Text>
        <Pressable onPress={onDelete} disabled={borrando} hitSlop={8}>
          <Text style={styles.deleteText}>{borrando ? 'Borrando…' : 'Eliminar'}</Text>
        </Pressable>
      </View>

      <StarRating value={resena.calificacion} readonly size={16} />

      {!!resena.comentario && <Text style={styles.comentario}>{resena.comentario}</Text>}

      {!!resena.fecha && (
        <Text style={styles.fecha}>{new Date(resena.fecha).toLocaleDateString()}</Text>
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
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicioNombre: { fontSize: 15, fontWeight: '600', color: '#1E3A8A', flexShrink: 1 },
  deleteText: { fontSize: 12, fontWeight: '600', color: '#dc2626' },
  comentario: { fontSize: 14, color: '#171717' },
  fecha: { fontSize: 11, color: '#a3a3a3' },
});
