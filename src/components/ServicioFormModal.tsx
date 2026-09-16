import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from './Button';
import Field from './Field';
import MapPicker from './MapPicker';
import PickerField, { type PickerOption } from './PickerField';
import { getCategorias } from '../api/categoria';
import { getMunicipios } from '../api/municipio';
import { createServicio } from '../api/servicio';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

type ServicioForm = {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  horario_atencion: string;
  precio: string;
};

export default function ServicioFormModal({ visible, onClose, onCreated }: Props) {
  const [categorias, setCategorias] = useState<PickerOption[]>([]);
  const [municipios, setMunicipios] = useState<PickerOption[]>([]);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pickerErrors, setPickerErrors] = useState<{ categoria?: string; municipio?: string; ubicacion?: string }>({});

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
    if (!visible) return;

    getCategorias().then(({ data }) =>
      setCategorias(data.map((c) => ({ id: c._id, nombre: c.nombre }))),
    );
    getMunicipios().then(({ data }) =>
      setMunicipios(data.map((m) => ({ id: m._id, nombre: m.nombre }))),
    );
  }, [visible]);

  function resetAll() {
    reset();
    setCategoriaId(null);
    setMunicipioId(null);
    setCoords({ lat: null, lng: null });
    setSubmitError(null);
    setPickerErrors({});
  }

  function handleClose() {
    resetAll();
    onClose();
  }

  const submit = async (values: ServicioForm) => {
    const errors: typeof pickerErrors = {};
    if (!categoriaId) errors.categoria = 'Selecciona una categoría';
    if (!municipioId) errors.municipio = 'Selecciona un municipio';
    if (coords.lat === null || coords.lng === null) errors.ubicacion = 'Selecciona la ubicación en el mapa';

    setPickerErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Añadir servicio</Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <Field
              control={control}
              name="nombre"
              label="Nombre"
              placeholder="Ej. Café La Cima"
              rules={{
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              }}
            />

            <PickerField
              label="Categoría"
              value={categoriaId}
              options={categorias}
              onChange={setCategoriaId}
              placeholder="Selecciona una categoría"
              error={pickerErrors.categoria}
            />

            <PickerField
              label="Municipio"
              value={municipioId}
              options={municipios}
              onChange={setMunicipioId}
              placeholder="Selecciona un municipio"
              error={pickerErrors.municipio}
            />

            <Field
              control={control}
              name="direccion"
              label="Dirección"
              placeholder="Cra 23 # 45-67"
            />

            <Field
              control={control}
              name="descripcion"
              label="Descripción"
              placeholder="Cuéntale a los viajeros qué ofreces"
              multiline
              numberOfLines={3}
            />

            <Field
              control={control}
              name="telefono"
              label="Teléfono"
              placeholder="3001234567"
              keyboardType="phone-pad"
            />

            <Field
              control={control}
              name="horario_atencion"
              label="Horario de atención"
              placeholder="Lun a dom, 8am - 8pm"
            />

            <Field
              control={control}
              name="precio"
              label="Precio (opcional)"
              placeholder="0"
              keyboardType="numeric"
            />

            <MapPicker
              latitud={coords.lat}
              longitud={coords.lng}
              onChange={(lat, lng) => setCoords({ lat, lng })}
            />
            {!!pickerErrors.ubicacion && (
              <Text style={styles.errorText}>{pickerErrors.ubicacion}</Text>
            )}

            {!!submitError && <Text style={styles.errorBox}>{submitError}</Text>}

            <Button
              text={formState.isSubmitting ? 'Guardando…' : 'Guardar servicio'}
              onPress={handleSubmit(submit)}
              disabled={formState.isSubmitting}
            />
          </ScrollView>
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
    backgroundColor: '#FAF4E4',
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
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9B8',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0147B9' },
  closeText: { fontSize: 18, color: '#a3a3a3' },
  form: { padding: 24, gap: 16 },
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FAF4E4',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#dc2626',
  },
});