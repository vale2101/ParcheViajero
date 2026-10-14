import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ServicioFichaModal from './ServicioResenaModal';
import ServicioReviewModal from './ServicioReviewModal';
import { useFavoritos } from '../context/FavoritosContext';
import { getServicios, type Servicio } from '../api/servicio';
import { styles } from '../styles/FavoritosSection.styles';

export default function FavoritosSection() {
  const { favoritos, toggleFavorito } = useFavoritos();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
  const [resenando, setResenando] = useState(false);

  useEffect(() => {
    getServicios()
      .then(({ data }) => setServicios(data))
      .catch(() => setServicios([]));
  }, []);

  // Nos quedamos solo con los servicios que el usuario marcó con corazón
  const misFavoritos = servicios.filter((s) => favoritos.includes(s._id));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mis favoritos</Text>

      {misFavoritos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.placeholder}>Aún no tienes favoritos guardados</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {misFavoritos.map((servicio) => (
            <Pressable
              key={servicio._id}
              style={styles.card}
              onPress={() => setSeleccionado(servicio)}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{servicio.nombre}</Text>
                {!!servicio.direccion && (
                  <Text style={styles.cardSubtitle}>{servicio.direccion}</Text>
                )}
              </View>

              {/* Corazón para quitarlo de favoritos */}
              <Pressable onPress={() => toggleFavorito(servicio._id)} hitSlop={8}>
                <Ionicons name="heart" size={22} color="#dc2626" />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}

      {/* Al tocar un favorito se abre la ficha del lugar */}
      <ServicioFichaModal
        visible={!!seleccionado && !resenando}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
        onDejarResena={() => setResenando(true)}
      />

      <ServicioReviewModal
        visible={resenando}
        servicio={seleccionado}
        onClose={() => setResenando(false)}
      />
    </View>
  );
}
