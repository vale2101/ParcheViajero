import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { deleteServicio, updateServicio, type Servicio } from '../api/servicio';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted: () => void;
}

type ServicioForm = {
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  horario_atencion: string;
  precio: string;
};

export default function ServicioEditModal({
  visible,
  servicio,
  onClose,
  onUpdated,
  onDeleted,
}: Props) {
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
    if (!visible) return;

    getCategorias().then(({ data }) =>
      setCategorias(data.map((c) => ({ id: c._id, nombre: c.nombre }))),
    );
    getMunicipios().then(({ data }) =>
      setMunicipios(data.map((m) => ({ id: m._id, nombre: m.nombre }))),
    );
  }, [visible]);

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

  function handleClose() {
    setConfirmandoBorrado(false);
    onClose();
  }

  const submit = async (values: ServicioForm) => {
    if (!servicio) return;

    const errors: typeof pickerErrors = {};
    if (!categoriaId) errors.categoria = 'Selecciona una categoría';
    if (!municipioId) errors.municipio = 'Selecciona un municipio';
    if (coords.lat === null || coords.lng === null) errors.ubicacion = 'Selecciona la ubicación en el mapa';

    setPickerErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
  };

  async function handleDelete() {
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

  if (!servicio) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar servicio</Text>
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

            <Field control={control} name="direccion" label="Dirección" placeholder="Cra 23 # 45-67" />

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
              text={formState.isSubmitting ? 'Guardando…' : 'Guardar cambios'}
              onPress={handleSubmit(submit)}
              disabled={formState.isSubmitting || borrando}
            />

            {!confirmandoBorrado ? (
              <Button
                text="Eliminar servicio"
                onPress={() => setConfirmandoBorrado(true)}
                secondary
                disabled={borrando}
              />
            ) : (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>
                  ¿Seguro que quieres eliminar este servicio? Esta acción no se puede deshacer.
                </Text>
                <View style={styles.confirmRow}>
                  <Button
                    text="Cancelar"
                    onPress={() => setConfirmandoBorrado(false)}
                    secondary
                    style={styles.confirmButton}
                    disabled={borrando}
                  />
                  <Button
                    text={borrando ? 'Eliminando…' : 'Sí, eliminar'}
                    onPress={handleDelete}
                    style={styles.confirmButton}
                    disabled={borrando}
                  />
                </View>
              </View>
            )}
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