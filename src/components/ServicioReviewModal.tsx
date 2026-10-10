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
import { useServicioResenas } from '../hooks/useServicioResenas';
import { validarCalificacion } from '../utils/validaciones';
import type { Servicio } from '../api/servicio';
import { styles } from '../styles/ServicioReviewModal.styles';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
}

export default function ServicioReviewModal({ visible, servicio, onClose }: Props) {
  const {
    usuarioId,
    resenas,
    loading,
    calificacion,
    setCalificacion,
    comentario,
    setComentario,
    error,
    setError,
    submitting,
    miResena,
    enviar,
  } = useServicioResenas(servicio, visible);

  async function handleSubmit() {
    const mensaje = validarCalificacion(calificacion);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    await enviar();
  }

  if (!servicio) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
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
                {item.usuario_id === usuarioId && (
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}