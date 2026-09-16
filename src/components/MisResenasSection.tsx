import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { deleteResena, getResenas, type Resena } from '../api/resena';
import { getServicios, type Servicio } from '../api/servicio';

export default function MisResenasSection() {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [servicios, setServicios] = useState<Record<string, Servicio>>({});
  const [loading, setLoading] = useState(true);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: todasResenas }, { data: todosServicios }] = await Promise.all([
        getResenas(),
        getServicios(),
      ]);

      const mias = todasResenas.filter((r) => r.usuario_id === user._id);
      const mapaServicios = Object.fromEntries(todosServicios.map((s) => [s._id, s]));

      setResenas(mias);
      setServicios(mapaServicios);
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function handleDelete(id: string) {
    setBorrandoId(id);
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((r) => r._id !== id));
    } catch {
      // se puede mostrar un error si se desea
    } finally {
      setBorrandoId(null);
    }
  }

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
          renderItem={({ item }) => {
            const servicio = servicios[item.servicio_id];
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.servicioNombre}>
                    {servicio?.nombre ?? 'Servicio eliminado'}
                  </Text>
                  <Pressable
                    onPress={() => handleDelete(item._id)}
                    disabled={borrandoId === item._id}
                    hitSlop={8}>
                    <Text style={styles.deleteText}>
                      {borrandoId === item._id ? 'Borrando…' : 'Eliminar'}
                    </Text>
                  </Pressable>
                </View>

                <StarRating value={item.calificacion} readonly size={16} />

                {!!item.comentario && <Text style={styles.comentario}>{item.comentario}</Text>}

                {!!item.fecha && (
                  <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0147B9' },
  placeholder: { color: '#a3a3a3', fontSize: 14 },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 20,
    alignItems: 'center',
  },
  list: { gap: 12 },
  card: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicioNombre: { fontSize: 15, fontWeight: '600', color: '#0147B9', flexShrink: 1 },
  deleteText: { fontSize: 12, fontWeight: '600', color: '#dc2626' },
  comentario: { fontSize: 14, color: '#171717' },
  fecha: { fontSize: 11, color: '#a3a3a3' },
});