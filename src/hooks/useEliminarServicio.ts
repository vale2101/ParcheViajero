import { useEffect, useState } from 'react';
import { deleteServicio, type Servicio } from '../api/servicio';

interface Opciones {
  visible: boolean;
  servicio: Servicio | null;
  onDeleted: () => void;
}

// Maneja la confirmación y el borrado de un servicio
export function useEliminarServicio({ visible, servicio, onDeleted }: Opciones) {
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cada vez que se abre el modal se reinicia el estado
  useEffect(() => {
    setConfirmando(false);
    setError(null);
  }, [visible, servicio]);

  async function eliminar() {
    if (!servicio) return;

    setBorrando(true);
    setError(null);

    try {
      await deleteServicio(servicio._id);
      onDeleted();
    } catch (e) {
      setError((e as Error).message);
      setConfirmando(false);
    } finally {
      setBorrando(false);
    }
  }

  return { confirmando, setConfirmando, borrando, error, eliminar };
}
