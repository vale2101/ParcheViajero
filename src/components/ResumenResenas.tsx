import { StyleSheet, Text, View } from 'react-native';
import StarRating from './StarRating';
import { useResumenResenas } from '../hooks/useResumenResenas';
import type { Resena } from '../api/resena';

// Promedio grande + barras con cuántas reseñas hay de cada estrella
export default function ResumenResenas({ resenas }: { resenas: Resena[] }) {
  const { total, promedio, conteo } = useResumenResenas(resenas);

  return (
    <View style={styles.box}>
      <View style={styles.left}>
        <Text style={styles.promedio}>{total > 0 ? promedio.toFixed(1) : '–'}</Text>
        <StarRating value={Math.round(promedio)} readonly size={14} />
        <Text style={styles.total}>
          {total} {total === 1 ? 'reseña' : 'reseñas'}
        </Text>
      </View>

      <View style={styles.bars}>
        {[5, 4, 3, 2, 1].map((estrellas) => {
          const cantidad = conteo[estrellas - 1];
          const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;

          return (
            <View key={estrellas} style={styles.barRow}>
              <Text style={styles.barLabel}>{estrellas}★</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${porcentaje}%` }]} />
              </View>
              <Text style={styles.barCount}>{cantidad}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    padding: 16,
  },
  left: { alignItems: 'center', gap: 2 },
  promedio: { fontSize: 44, fontWeight: '700', color: '#1E3A8A', lineHeight: 50 },
  total: { fontSize: 12, color: '#737373' },
  bars: { flex: 1, gap: 5 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { width: 20, fontSize: 12, color: '#737373' },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#e5e5e5', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: '#F5B700' },
  barCount: { width: 20, textAlign: 'right', fontSize: 12, color: '#737373' },
});
