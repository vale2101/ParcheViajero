import { FlatList, StyleSheet, Text, View } from 'react-native';
import MisResenaCard from './MisResenaCard';
import { useMisResenas } from '../hooks/useMisResenas';

export default function MisResenasSection() {
  const { resenas, servicios, loading, borrandoId, borrar } = useMisResenas();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mis reseñas</Text>

      {loading ? (
        <Text style={styles.placeholder}>Cargando tus reseñas…</Text>
      ) : resenas.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.placeholder}>Aún no has escrito ninguna reseña</Text>
        </View>
      ) : (
        <FlatList
          data={resenas}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MisResenaCard
              resena={item}
              servicio={servicios[item.servicio_id]}
              borrando={borrandoId === item._id}
              onDelete={() => borrar(item._id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  placeholder: { color: '#a3a3a3', fontSize: 14 },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 20,
    alignItems: 'center',
  },
  list: { gap: 12 },
});
