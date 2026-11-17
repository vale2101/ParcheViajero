import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';
import { getServicios, type Servicio } from '../api/servicio';
import { useFavoritos } from '../context/FavoritosContext';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { styles } from '../styles/FavoritosSection.styles';

// Cuántos favoritos se ven antes de desplegar
const MAX_VISIBLES = 4;

export default function FavoritosSection() {
  const { favoritos: favoritosIds, toggleFavorito } = useFavoritos();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [serviciosRespuesta, categoriasRespuesta, municipiosRespuesta] =
          await Promise.all([getServicios(), getCategorias(), getMunicipios()]);

        setServicios(serviciosRespuesta.data);
        setCategorias(categoriasRespuesta.data);
        setMunicipios(municipiosRespuesta.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los favoritos');
      }
    }

    cargarDatos();
  }, []);

  const favoritos = favoritosIds
    .map((id) => servicios.find((servicio) => servicio._id === id))
    .filter((servicio): servicio is Servicio => servicio !== undefined);

  function obtenerCategoria(servicio: Servicio) {
    return categorias.find((categoria) => categoria._id === servicio.categoria_id)?.nombre;
  }

  function obtenerMunicipio(servicio: Servicio) {
    return municipios.find((municipio) => municipio._id === servicio.municipio_id)?.nombre;
  }

  const visibles = expandido ? favoritos : favoritos.slice(0, MAX_VISIBLES);
  const ocultos = favoritos.length - MAX_VISIBLES;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Ionicons name="star" size={18} color="#E9B85B" />
          <Text style={styles.sectionTitle}>Mis favoritos</Text>
        </View>
        {favoritos.length > 0 && (
          <Text style={styles.count}>
            {favoritos.length} {favoritos.length === 1 ? 'lugar' : 'lugares'}
          </Text>
        )}
      </View>

      {error ? (
        <View style={styles.emptyBox}>
          <Text style={styles.placeholder}>{error}</Text>
        </View>
      ) : favoritos.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <Ionicons name="map-outline" size={26} color="#8A5A00" />
          </View>
          <Text style={styles.placeholder}>Aún no tienes favoritos guardados</Text>
        </View>
      ) : (
        <View style={styles.box}>
          {visibles.map((fav, index) => {
            const visual = getCategoriaVisual(obtenerCategoria(fav));

            return (
              <View key={fav._id} style={[styles.row, index > 0 && styles.rowBorder]}>
                <View style={[styles.iconCircle, { backgroundColor: visual.color }]}>
                  <Text style={styles.emoji}>{visual.emoji}</Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.nombre}>{fav.nombre}</Text>
                  <Text style={styles.municipio}>{obtenerMunicipio(fav) ?? 'Municipio no disponible'}</Text>
                </View>

                <Pressable onPress={() => toggleFavorito(fav._id)} hitSlop={8}>
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
