import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import ErrorBox from './ErrorBox';
import ModalSheet from './ModalSheet';
import ServicioFormFields from './ServicioFormFields';
import { useEliminarServicio } from '../hooks/useEliminarServicio';
import { useServicioForm } from '../hooks/useServicioForm';
import type { Servicio } from '../api/servicio';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function ServicioEditModal({
  visible,
  servicio,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
  const form = useServicioForm({
    visible,
    servicio,
    onSaved: () => {
      onUpdated();
      onClose();
    },
  });

  const borrado = useEliminarServicio({
    visible,
    servicio,
    onDeleted: () => {
      onDeleted();
      onClose();
    },
  });

  if (!servicio) return null;

  return (
    <ModalSheet visible={visible} title="Editar servicio" onClose={onClose}>
      <ServicioFormFields form={form} />

      {!!borrado.error && <ErrorBox message={borrado.error} />}

      <Button
        text={form.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
        onPress={form.guardar}
        disabled={form.isSubmitting || borrado.borrando}
      />

      {!borrado.confirmando ? (
        <Button
          text="Eliminar servicio"
          onPress={() => borrado.setConfirmando(true)}
          secondary
          disabled={borrado.borrando}
        />
      ) : (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>
            ¿Seguro que quieres eliminar este servicio? Esta acción no se puede deshacer.
          </Text>
          <View style={styles.confirmRow}>
            <Button
              text="Cancelar"
              onPress={() => borrado.setConfirmando(false)}
              secondary
              style={styles.confirmButton}
              disabled={borrado.borrando}
            />
            <Button
              text={borrado.borrando ? 'Eliminando…' : 'Sí, eliminar'}
              onPress={borrado.eliminar}
              style={styles.confirmButton}
              disabled={borrado.borrando}
            />
          </View>
        </View>
      )}
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  confirmBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 16,
    gap: 12,
  },
  confirmText: { fontSize: 13, color: '#171717' },
  confirmRow: { flexDirection: 'row', gap: 10 },
  confirmButton: { flex: 1 },
});
