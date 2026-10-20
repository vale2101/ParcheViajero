import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import StarRating from './StarRating';

import { styles } from '../styles/ResenasNegocioSection.styles';
import { getResenas } from '../api/resena';

// Convierte una fecha en "hace 2 días"
function haceCuanto(fecha: string) {
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias} días`;
}

export default function ResenasNegocioSection() {
  const [resenas, setResenas] = useState<any[]>([]);

  useEffect(() => {
    getResenas().then((respuesta) => setResenas(respuesta.data));
  }, []);

  const promedio =
    resenas.length > 0
      ? resenas.reduce((suma, r) => suma + r.calificacion, 0) / resenas.length
      : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Reseñas de tus clientes</Text>

      {resenas.length > 0 && (
        <View style={styles.resumen}>
          <Text style={styles.promedio}>{promedio.toFixed(1)}</Text>
          <StarRating value={Math.round(promedio)} readonly size={18} />
          <Text style={styles.totalText}>({resenas.length} reseñas)</Text>
        </View>
      )}

      {resenas.length === 0 ? (
        <Text style={styles.placeholder}>Aún no tienes reseñas</Text>
      ) : (
        resenas.map((r) => (
          <View key={r._id} style={styles.card}>
            <View style={styles.cardTop}>
              {r.clienteFoto ? (
                <Image source={{ uri: r.clienteFoto }} style={styles.avatarFoto} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{r.clienteNombre.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View>
                <Text style={styles.nombre}>{r.clienteNombre}</Text>
                <Text style={styles.fecha}>{haceCuanto(r.fecha)}</Text>
              </View>
            </View>

            <StarRating value={r.calificacion} readonly size={16} />

            {!!r.comentario && <Text style={styles.comentario}>{r.comentario}</Text>}
          </View>
        ))
      )}
    </View>
  );
}
