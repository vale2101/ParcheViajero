import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AccionesLugar from './AccionesLugar';
import FiltroChips from './FiltroChips';
import ResenaCard from './ResenaCard';
import ResenaForm from './ResenaForm';
import ResumenResenas from './ResumenResenas';
import { useComoLlegar } from '../hooks/useComoLlegar';
import { useResenasServicio } from '../hooks/useResenasServicio';
import type { Servicio } from '../api/servicio';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
}

export default function ServicioReviewModal({ visible, servicio, onClose }: Props) {
  const r = useResenasServicio(visible, servicio);
  const ruta = useComoLlegar(servicio);

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
            {!!servicio.direccion && <Text style={styles.infoText}>📍 {servicio.direccion}</Text>}
            {!!servicio.horario_atencion && (
              <Text style={styles.infoText}>🕒 {servicio.horario_atencion}</Text>
            )}
            {!!servicio.telefono && <Text style={styles.infoText}>📞 {servicio.telefono}</Text>}
          </View>

          <FlatList
            data={r.ordenadas}
            keyExtractor={(item) => item._id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerList}>
                <ResumenResenas resenas={r.resenas} />
                <FiltroChips
                  value={r.orden}
                  onChange={r.setOrden}
                  opciones={[
                    { value: 'recientes', label: 'Más recientes' },
                    { value: 'mejores', label: 'Mejor calificadas' },
                  ]}
                />
              </View>
            }
            ListEmptyComponent={
              !r.loading ? (
                <Text style={styles.placeholder}>Aún no hay reseñas. ¡Sé el primero en opinar!</Text>
              ) : null
            }
            renderItem={({ item }) => (
              <ResenaCard
                resena={item}
                nombre={r.nombres[item.usuario_id]}
                esMia={item.usuario_id === r.usuarioId}
                borrando={r.borrandoId === item._id}
                onDelete={() => r.borrar(item._id)}
              />
            )}
            ListFooterComponent={
              r.formVisible ? (
                <ResenaForm
                  calificacion={r.calificacion}
                  onCalificacionChange={r.setCalificacion}
                  comentario={r.comentario}
                  onComentarioChange={r.setComentario}
                  error={r.error}
                  submitting={r.submitting}
                  onSubmit={r.publicar}
                />
              ) : null
            }
          />

          <AccionesLugar onResena={r.toggleForm} onRuta={ruta.abrirRuta} errorRuta={ruta.error} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
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
  infoText: { fontSize: 13, color: '#737373' },
  list: { paddingHorizontal: 24, flexShrink: 1 },
  listContent: { gap: 12, paddingVertical: 16 },
  headerList: { gap: 12 },
  placeholder: { color: '#737373', fontSize: 14, textAlign: 'center', marginVertical: 12 },
});
