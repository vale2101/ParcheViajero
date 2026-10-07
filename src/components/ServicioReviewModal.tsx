import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from './Button';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { createResena, updateResena, getResenasByServicio, type Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';
import { styles } from '../styles/ServicioReviewModal.styles';

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
