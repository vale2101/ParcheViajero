import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getFavoritos, type Favorito } from '../favoritosejmplos';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { styles } from '../styles/FavoritosSection.styles';

// Cuántos favoritos se ven antes de desplegar
const MAX_VISIBLES = 4;

export default function FavoritosSection() {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    getFavoritos().then(setFavoritos);
  }, []);

  // Quita el favorito de la lista (por ahora solo en la pantalla;
  // cuando haya backend aquí se llama a la API para borrarlo)
  function quitarFavorito(id: string) {
    setFavoritos((prev) => prev.filter((f) => f._id !== id));
  }

  const visibles = expandido ? favoritos : favoritos.slice(0, MAX_VISIBLES);
  const ocultos = favoritos.length - MAX_VISIBLES;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Mis favoritos</Text>
        {favoritos.length > 0 && <Text style={styles.count}>{favoritos.length} lugares</Text>}
      </View>

      {favoritos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.placeholder}>Aún no tienes favoritos guardados</Text>
        </View>
      ) : (
        <View style={styles.box}>
          {visibles.map((fav, index) => {
            const visual = getCategoriaVisual(fav.categoria);

            return (
              <View key={fav._id} style={[styles.row, index > 0 && styles.rowBorder]}>
                <View style={[styles.iconCircle, { backgroundColor: visual.color }]}>
                  <Text style={styles.emoji}>{visual.emoji}</Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.nombre}>{fav.nombre}</Text>
                  <Text style={styles.municipio}>{fav.municipio}</Text>
                </View>

                <Pressable onPress={() => quitarFavorito(fav._id)} hitSlop={8}>
                  <Ionicons name="heart" size={20} color="#dc2626" />
                </Pressable>
              </View>
            );
          })}

          {ocultos > 0 && (
            <Pressable style={styles.verMasButton} onPress={() => setExpandido(!expandido)}>
              <Text style={styles.verMasText}>
                {expandido ? 'Ver menos' : `Ver los otros ${ocultos}`}
              </Text>
              <Ionicons
                name={expandido ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#0147B9"
              />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
