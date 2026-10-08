import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createServicio, updateServicio, type Servicio } from '../api/servicio';
import { useCatalogos } from './useCatalogos';

export type ServicioForm = {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  horario_atencion: string;
  precio: string;
};

type Coords = { lat: number | null; lng: number | null };
type PickerErrors = { categoria?: string; municipio?: string; ubicacion?: string };

interface Opciones {
  visible: boolean;
  servicio?: Servicio | null; // si viene un servicio es modo editar, si no es crear
  onSaved: () => void;
}

const valoresVacios: ServicioForm = {
  nombre: '',
  descripcion: '',
  direccion: '',
  telefono: '',
  horario_atencion: '',
  precio: '',
};

// Hook que sirve para crear y para editar un servicio
export function useServicioForm({ visible, servicio, onSaved }: Opciones) {
  const { categorias, municipios } = useCatalogos(visible);

  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords>({ lat: null, lng: null });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pickerErrors, setPickerErrors] = useState<PickerErrors>({});

  const { control, handleSubmit, reset, formState } = useForm<ServicioForm>({
    defaultValues: valoresVacios,
  });

  // Si estamos editando, llenamos el formulario con los datos del servicio
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
  }, [visible, servicio, reset]);

  function limpiar() {
    reset(valoresVacios);
    setCategoriaId(null);
    setMunicipioId(null);
    setCoords({ lat: null, lng: null });
    setSubmitError(null);
    setPickerErrors({});
  }

  // Valida lo que no maneja react-hook-form (selectores y mapa)
  function validarSelectores() {
    const errors: PickerErrors = {};
    if (!categoriaId) errors.categoria = 'Selecciona una categoría';
    if (!municipioId) errors.municipio = 'Selecciona un municipio';
    if (coords.lat === null || coords.lng === null) {
      errors.ubicacion = 'Selecciona la ubicación en el mapa';
    }

    setPickerErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const guardar = async (values: ServicioForm) => {
    if (!validarSelectores()) return;

    setSubmitError(null);

    const datos = {
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
    };

    try {
      if (servicio) {
        await updateServicio(servicio._id, datos);
      } else {
        await createServicio(datos);
        limpiar();
      }
      onSaved();
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  };

  return {
    control,
    categorias,
    municipios,
    categoriaId,
    setCategoriaId,
    municipioId,
    setMunicipioId,
    coords,
    setCoords,
    submitError,
    pickerErrors,
    isSubmitting: formState.isSubmitting,
    limpiar,
    guardar: handleSubmit(guardar),
  };
}

export type ServicioFormState = ReturnType<typeof useServicioForm>;
