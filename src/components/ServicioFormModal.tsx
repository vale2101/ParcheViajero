import Button from './Button';
import ModalSheet from './ModalSheet';
import ServicioFormFields from './ServicioFormFields';
import { useServicioForm } from '../hooks/useServicioForm';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function ServicioFormModal({ visible, onClose, onCreated }: Props) {
  const form = useServicioForm({
    visible,
    onSaved: () => {
      onCreated();
      onClose();
    },
  });

  function handleClose() {
    form.limpiar();
    onClose();
  }

  return (
    <ModalSheet visible={visible} title="Añadir servicio" onClose={handleClose}>
      <ServicioFormFields form={form} />

      <Button
        text={form.isSubmitting ? 'Guardando…' : 'Guardar servicio'}
        onPress={form.guardar}
        disabled={form.isSubmitting}
      />
    </ModalSheet>
  );
}
