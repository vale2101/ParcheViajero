import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import ServicioReviewModal from './ServicioReviewModal';
import { getServicios, type Servicio } from '../api/servicio';
import { styles } from '../styles/ResenasSection.styles';

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
      : servicios.filter((s) =>
          s.nombre.toLowerCase().includes(query.trim().toLowerCase())
        );

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
        <View style={styles.resultsList}>
          {resultados.length === 0 ? (
            <Text style={styles.placeholder}>
              No se encontraron lugares con ese nombre
            </Text>
          ) : (
            resultados.map((item) => (
              <Pressable
                key={item._id}
                style={styles.resultCard}
                onPress={() => setSeleccionado(item)}
              >
                <Text style={styles.resultName}>{item.nombre}</Text>

                {!!item.direccion && (
                  <Text style={styles.resultSubtitle}>
                    {item.direccion}
                  </Text>
                )}
              </Pressable>
            ))
          )}
        </View>
      )}

      <ServicioReviewModal
        visible={!!seleccionado}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
      />
    </View>
  );
}
