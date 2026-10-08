import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Button from './Button';
import Field from './Field';
import MapPicker from './MapPicker';
import PickerField from './PickerField';
import { useCatalogos } from '../hooks/useCatalogos';
import { useServicioEditForm } from '../hooks/useServicioEditForm';
import { reglaNombre, validarSelecciones } from '../utils/validaciones';
import type { Servicio } from '../api/servicio';
import type { ServicioForm } from '../types';
import { styles } from '../styles/ServicioEditModal.styles';

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
  const { categorias, municipios } = useCatalogos(visible);

  const {
    control,
    handleSubmit,
    isSubmitting,
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
  } = useServicioEditForm({ servicio, visible, onClose, onUpdated, onDeleted });

  const submit = async (values: ServicioForm) => {
    if (!servicio) return;

    const errores = validarSelecciones({
      categoriaId,
      municipioId,
      lat: coords.lat,
      lng: coords.lng,
    });

    setPickerErrors(errores);
    if (Object.keys(errores).length > 0) return;

    await actualizar(values);
  };

  if (!servicio) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cerrar}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar servicio</Text>
            <Pressable onPress={cerrar} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <Field
              control={control}
              name="nombre"
              label="Nombre"
              placeholder="Ej. Café La Cima"
              rules={reglaNombre}
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
              text={isSubmitting ? 'Guardando…' : 'Guardar cambios'}
              onPress={handleSubmit(submit)}
              disabled={isSubmitting || borrando}
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
                    onPress={eliminar}
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