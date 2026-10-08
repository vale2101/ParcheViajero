import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createServicio } from '../api/servicio';
import type { ServicioForm } from '../types';
import type { ErroresSelecciones } from '../utils/validaciones';

interface Opciones {
  onCreated: () => void;
  onClose: () => void;
}

export function useServicioCreateForm({ onCreated, onClose }: Opciones) {
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pickerErrors, setPickerErrors] = useState<ErroresSelecciones>({});

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

  function resetAll() {
    reset();
    setCategoriaId(null);
    setMunicipioId(null);
    setCoords({ lat: null, lng: null });
    setSubmitError(null);
    setPickerErrors({});
  }

  function cerrar() {
    resetAll();
    onClose();
  }

  async function crear(values: ServicioForm) {
    setSubmitError(null);

    try {
      await createServicio({
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

      resetAll();
      onCreated();
      onClose();
    } catch (error) {
      setSubmitError((error as Error).message);
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
    crear,
    cerrar,
  };
}