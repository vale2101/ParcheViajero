import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ServicioReviewModal from './ServicioReviewModal';
import { getServicios, type Servicio } from '../api/servicio';

export default function ResenasSection() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [query, setQuery] = useState('');
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  useEffect(() => {
    getServicios()
      .then(({ data }) => setServicios(data))
      .catch(() => setServicios([]));
  }, []);

  const resultados =
    query.trim().length === 0
      ? []
      : servicios.filter((s) => s.nombre.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reseñas</Text>

      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Busca un restaurante o lugar por nombre"
        placeholderTextColor="#a3a3a3"
      />

      {query.trim().length > 0 && (
        <FlatList
          data={resultados}
          keyExtractor={(item) => item._id}
          style={styles.resultsList}
          ListEmptyComponent={
            <Text style={styles.placeholder}>No se encontraron lugares con ese nombre</Text>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.resultCard} onPress={() => setSeleccionado(item)}>
              <Text style={styles.resultName}>{item.nombre}</Text>
              {!!item.direccion && <Text style={styles.resultSubtitle}>{item.direccion}</Text>}
            </Pressable>
          )}
        />
      )}

      <ServicioReviewModal
        visible={!!seleccionado}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0147B9' },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 14,
    fontSize: 15,
    color: '#171717',
  },
  resultsList: { maxHeight: 240 },
  placeholder: { color: '#a3a3a3', fontSize: 13, textAlign: 'center', marginVertical: 12 },
  resultCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 12,
    marginBottom: 8,
  },
  resultName: { fontSize: 15, fontWeight: '600', color: '#0147B9' },
  resultSubtitle: { fontSize: 12, color: '#a3a3a3', marginTop: 2 },
});