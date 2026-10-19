import type { Control } from 'react-hook-form';
import { Switch, Text, View, type LayoutChangeEvent } from 'react-native';
import Field from '../components/Field';
import type { WizardForm } from '../hooks/useServicioWizard';
import { reglaPrecio, reglaTelefonoServicio } from '../utils/validacionesServicio';
import { styles } from '../styles/ServicioWizard.styles';

interface Props {
  control: Control<WizardForm>;
  gratuito: boolean;
  onGratuito: (valor: boolean) => void;
  ancla: (nombre: string) => (e: LayoutChangeEvent) => void;
}

export default function StepContacto({ control, gratuito, onGratuito, ancla }: Props) {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>Contacto y condiciones</Text>
      <Text style={styles.stepSubtitle}>Estos datos son opcionales, pero ayudan a los viajeros.</Text>

      <View onLayout={ancla('telefono')}>
        <Field
          control={control}
          name="telefono"
          label="Teléfono (opcional)"
          placeholder="3001234567"
          keyboardType="phone-pad"
          rules={reglaTelefonoServicio}
        />
      </View>

      <View onLayout={ancla('horario_atencion')}>
        <Field
          control={control}
          name="horario_atencion"
          label="Horario de atención (opcional)"
          placeholder="Lun a dom, 8am - 8pm"
          autoCapitalize="sentences"
        />
      </View>

      <View onLayout={ancla('precio')} style={styles.block}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Gratuito / el precio no aplica</Text>
            <Text style={styles.helpText}>Si lo activas, no se enviará ningún precio.</Text>
          </View>
          <Switch
            value={gratuito}
            onValueChange={onGratuito}
            trackColor={{ false: '#E8D9B8', true: '#0147B9' }}
            thumbColor="#FDFBF6"
            accessibilityLabel="Gratuito o el precio no aplica"
          />
        </View>

        {!gratuito && (
          <>
            <Field
              control={control}
              name="precio"
              label="Precio (opcional)"
              placeholder="25000"
              keyboardType="number-pad"
              rules={reglaPrecio}
            />
            <Text style={styles.helpText}>Precio en pesos colombianos (COP), solo números.</Text>
          </>
        )}
      </View>
    </View>
  );
}