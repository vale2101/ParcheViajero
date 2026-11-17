import type { Control } from 'react-hook-form';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Field from '../components/Field';
import type { Categoria } from '../api/categoria';
import type { WizardForm } from '../hooks/useServicioWizard';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { reglaNombre } from '../utils/validaciones';
import { reglaDescripcion } from '../utils/validacionesServicio';
import { styles } from '../styles/ServicioWizard.styles';

interface Props {
  control: Control<WizardForm>;
  categorias: Categoria[];
  cargando: boolean;
  error: string | null;
  onReintentar: () => void;
  categoriaId: string | null;
  onSeleccionarCategoria: (id: string) => void;
  errorCategoria?: string | undefined;
  ancla: (nombre: string) => (e: LayoutChangeEvent) => void;
}

export default function StepBasica({
  control,
  categorias,
  cargando,
  error,
  onReintentar,
  categoriaId,
  onSeleccionarCategoria,
  errorCategoria,
  ancla,
}: Props) {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>Información básica</Text>
      <Text style={styles.stepSubtitle}>Cuéntale a los viajeros qué ofreces.</Text>

      <View onLayout={ancla('nombre')}>
        <Field
          control={control}
          name="nombre"
          label="Nombre del servicio"
          placeholder="Ej. Café La Cima"
          autoCapitalize="sentences"
          rules={reglaNombre}
        />
      </View>

      <View onLayout={ancla('descripcion')}>
        <Field
          control={control}
          name="descripcion"
          label="Descripción"
          placeholder="Qué ofreces, qué te hace especial…"
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
          rules={reglaDescripcion}
        />
      </View>

      <View onLayout={ancla('categoria')} style={styles.block}>
        <Text style={styles.label}>Categoría</Text>

        {cargando ? (
          <Loader tipo="compacto" texto="Cargando categorías…" />
        ) : error ? (
          <View style={styles.retryBox}>
            <Text style={styles.retryText}>{error}</Text>
            <Button text="Volver a intentar" onPress={onReintentar} secondary />
          </View>
        ) : (
          <View style={styles.categoryGrid}>
            {categorias.map((c) => {
              const visual = getCategoriaVisual(c.nombre);
              const activa = c._id === categoriaId;
              return (
                <Pressable
                  key={c._id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: activa }}
                  accessibilityLabel={`${c.nombre}${activa ? ', seleccionada' : ''}`}
                  style={[styles.categoryCard, activa && styles.categoryCardActive]}
                  onPress={() => onSeleccionarCategoria(c._id)}>
                  <Text style={styles.categoryEmoji}>{visual.emoji}</Text>
                  <Text style={[styles.categoryName, activa && styles.categoryNameActive]}>
                    {c.nombre}
                  </Text>
                  {activa && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#0147B9"
                      style={styles.categoryCheck}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {!!errorCategoria && <Text style={styles.errorText}>{errorCategoria}</Text>}
      </View>
    </View>
  );
}