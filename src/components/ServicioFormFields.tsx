import { StyleSheet, Text } from 'react-native';
import ErrorBox from './ErrorBox';
import Field from './Field';
import MapPicker from './MapPicker';
import PickerField from './PickerField';
import type { ServicioFormState } from '../hooks/useServicioForm';

interface Props {
  form: ServicioFormState;
}

// Campos del formulario de servicio (se usan al crear y al editar)
export default function ServicioFormFields({ form }: Props) {
  const { control, pickerErrors, coords } = form;

  return (
    <>
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
        value={form.categoriaId}
        options={form.categorias}
        onChange={form.setCategoriaId}
        placeholder="Selecciona una categoría"
        error={pickerErrors.categoria}
      />

      <PickerField
        label="Municipio"
        value={form.municipioId}
        options={form.municipios}
        onChange={form.setMunicipioId}
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
        onChange={(lat, lng) => form.setCoords({ lat, lng })}
      />
      {!!pickerErrors.ubicacion && <Text style={styles.errorText}>{pickerErrors.ubicacion}</Text>}

      {!!form.submitError && <ErrorBox message={form.submitError} />}
    </>
  );
}

const styles = StyleSheet.create({
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
});
