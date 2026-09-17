import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from './Button';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { createResena, updateResena, getResenasByServicio, type Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
}

export default function ServicioReviewModal({ visible, servicio, onClose }: Props) {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [miResena, setMiResena] = useState<Resena | null>(null);

  const cargarResenas = useCallback(async () => {
    if (!servicio) return;
    setLoading(true);
    try {
      const { data } = await getResenasByServicio(servicio._id);
      setResenas(data);

      // Si el usuario ya reseñó este servicio, precargamos su reseña para editarla
      const propia = data.find((r) => r.usuario_id === user?._id) ?? null;
      setMiResena(propia);
      setCalificacion(propia?.calificacion ?? 0);
      setComentario(propia?.comentario ?? '');
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [servicio, user?._id]);

  useEffect(() => {
    if (visible) {
      setError(null);
      cargarResenas();
    }
  }, [visible, cargarResenas]);

  async function handleSubmit() {
    if (!servicio || !user) return;

    if (calificacion < 1) {
      setError('Selecciona una calificación de 1 a 5 estrellas');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      if (miResena) {
        // Editar reseña existente
        await updateResena(miResena._id, {
          calificacion,
          comentario: comentario.trim() || undefined,
        });
      } else {
        // Crear reseña nueva
        await createResena({
          usuario_id: user._id,
          servicio_id: servicio._id,
          calificacion,
          comentario: comentario.trim() || undefined,
        });
      }

      await cargarResenas();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!servicio) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{servicio.nombre}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.infoBox}>
            {!!servicio.direccion && (
              <Text style={styles.infoText}>📍 {servicio.direccion}</Text>
            )}
            {!!servicio.horario_atencion && (
              <Text style={styles.infoText}>🕒 {servicio.horario_atencion}</Text>
            )}
          </View>

          <FlatList
            data={resenas}
            keyExtractor={(item) => item._id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              !loading ? (
                <Text style={styles.placeholder}>Aún no hay reseñas para este lugar</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <StarRating value={item.calificacion} readonly size={16} />
                {!!item.comentario && <Text style={styles.reviewText}>{item.comentario}</Text>}
                {!!item.fecha && (
                  <Text style={styles.reviewDate}>
                    {new Date(item.fecha).toLocaleDateString()}
                  </Text>
                )}
                {item.usuario_id === user?._id && (
                  <Text style={styles.miEtiqueta}>Tu reseña</Text>
                )}
              </View>
            )}
            ListFooterComponent={
              <View style={styles.formBox}>
                <Text style={styles.formTitle}>
                  {miResena ? 'Edita tu reseña' : 'Escribe tu reseña'}
                </Text>
                <StarRating value={calificacion} onChange={setCalificacion} />

                <TextInput
                  style={styles.textarea}
                  value={comentario}
                  onChangeText={setComentario}
                  placeholder="¿Qué tal estuvo tu experiencia?"
                  placeholderTextColor="#a3a3a3"
                  multiline
                  numberOfLines={3}
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Button
                  text={
                    submitting
                      ? 'Guardando…'
                      : miResena
                      ? 'Actualizar reseña'
                      : 'Publicar reseña'
                  }
                  onPress={handleSubmit}
                  disabled={submitting}
                />
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FDFBF6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#1E3A8A', flexShrink: 1 },
  closeText: { fontSize: 18, color: '#a3a3a3' },
  infoBox: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    gap: 4,
  },
  infoText: { fontSize: 13, color: '#a3a3a3' },
  list: { paddingHorizontal: 24 },
  listContent: { gap: 12, paddingVertical: 16 },
  placeholder: { color: '#a3a3a3', fontSize: 14, textAlign: 'center', marginVertical: 12 },
  reviewCard: { borderRadius: 12, borderWidth: 2, borderColor: '#e5e5e5', padding: 12, gap: 6 },
  reviewText: { fontSize: 14, color: '#171717' },
  reviewDate: { fontSize: 11, color: '#a3a3a3' },
  miEtiqueta: { fontSize: 11, fontWeight: '700', color: '#1E3A8A' },
  formBox: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e5e5', gap: 12 },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#1E3A8A' },
  textarea: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 12,
    fontSize: 14,
    color: '#171717',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
});