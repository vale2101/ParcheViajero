import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { deleteServicio, updateServicio, type Servicio } from '../api/servicio';
import type { ServicioForm } from '../types';
import type { ErroresSelecciones } from '../utils/validaciones';

interface Opciones {
  servicio: Servicio | null;
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

export function useServicioEditForm({ servicio, visible, onClose, onUpdated, onDeleted }: Opciones) {
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pickerErrors, setPickerErrors] = useState<ErroresSelecciones>({});
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const { control, handleSubmit, reset, formState } = useForm<ServicioForm>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      direccion: '',
      telefono: '',
      horario_atencion: '',
      precio: '',
    },
  });

  useEffect(() => {
    if (!visible || !servicio) return;

    reset({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion ?? '',
      direccion: servicio.direccion ?? '',
      telefono: servicio.telefono ?? '',
      horario_atencion: servicio.horario_atencion ?? '',
      precio: servicio.precio !== undefined ? String(servicio.precio) : '',
    });
    setCategoriaId(servicio.categoria_id);
    setMunicipioId(servicio.municipio_id);
    setCoords({ lat: servicio.latitud, lng: servicio.longitud });
    setSubmitError(null);
    setPickerErrors({});
    setConfirmandoBorrado(false);
  }, [visible, servicio, reset]);

  function cerrar() {
    setConfirmandoBorrado(false);
    onClose();
  }

  async function actualizar(values: ServicioForm) {
    if (!servicio) return;

    setSubmitError(null);

    try {
      await updateServicio(servicio._id, {
        categoria_id: categoriaId!,
        municipio_id: municipioId!,
        nombre: values.nombre,
        descripcion: values.descripcion || undefined,
        direccion: values.direccion || undefined,
        latitud: coords.lat!,
        longitud: coords.lng!,
        telefono: values.telefono || undefined,
        horario_atencion: values.horario_atencion || undefined,
        precio: values.precio ? Number(values.precio) : undefined,
      });

      onUpdated();
      onClose();
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  }

  async function eliminar() {
    if (!servicio) return;

    setBorrando(true);
    setSubmitError(null);

    try {
      await deleteServicio(servicio._id);
      onDeleted();
      onClose();
    } catch (error) {
      setSubmitError((error as Error).message);
      setConfirmandoBorrado(false);
    } finally {
      setBorrando(false);
    }
  }

  return {
    control,
    handleSubmit,
    isSubmitting: formState.isSubmitting,
    categoriaId,
    setCategoriaId,
    municipioId,
    setMunicipioId,
    coords,
    setCoords,
    submitError,
    pickerErrors,
    setPickerErrors,
    confirmandoBorrado,
    setConfirmandoBorrado,
    borrando,
    actualizar,
    eliminar,
    cerrar,
  };
}