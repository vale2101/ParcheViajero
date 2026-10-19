import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NOMBRES_PASOS, TOTAL_PASOS } from '../hooks/useServicioWizard';
import { styles } from '../styles/ServicioWizard.styles';

interface Props {
  paso: number;
  onIr: (paso: number) => void;
}

export default function WizardProgress({ paso, onIr }: Props) {
  const porcentaje = ((paso + 1) / TOTAL_PASOS) * 100;

  return (
    <View style={styles.progressBox}>
      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: TOTAL_PASOS, now: paso + 1 }}>
        <View style={[styles.progressFill, { width: `${porcentaje}%` }]} />
      </View>

      <View style={styles.dotsRow}>
        {NOMBRES_PASOS.map((nombre, i) => {
          const hecho = i < paso;
          const actual = i === paso;
          return (
            <Pressable
              key={nombre}
              style={styles.dotItem}
              disabled={!hecho}
              onPress={() => onIr(i)}
              accessibilityLabel={`${nombre}${hecho ? ', completado' : actual ? ', paso actual' : ''}`}>
              <View style={[styles.dot, hecho && styles.dotDone, actual && styles.dotActual]}>
                {hecho ? (
                  <Ionicons name="checkmark" size={14} color="#FEBA03" />
                ) : (
                  <Text style={[styles.dotText, actual && styles.dotTextActual]}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.dotLabel, actual && styles.dotLabelActual]} numberOfLines={1}>
                {nombre}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.progressText}>
        Paso {paso + 1} de {TOTAL_PASOS}
      </Text>
    </View>
  );
}