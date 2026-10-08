import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import ServicioReviewModal from './ServicioReviewModal';
import { useBuscarServicios } from '../hooks/useBuscarServicios';
import type { Servicio } from '../api/servicio';
import { styles } from '../styles/ResenasSection.styles';

export default function ResenasSection() {
  const { query, setQuery, busquedaActiva, resultados } = useBuscarServicios();
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

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

      {busquedaActiva && (
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