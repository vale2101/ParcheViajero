import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ServicioWizard.styles';

export default function StepImagenes() {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>Imágenes del servicio</Text>

      <View style={styles.imgNotice}>
        <Ionicons name="images-outline" size={44} color="#0147B9" />
        <Text style={styles.imgTitle}>Las imágenes aún no están disponibles</Text>
        <Text style={styles.imgText}>
          El servidor todavía no tiene el endpoint ni el almacenamiento para fotos de servicios
          (la colección imagenes_servicio existe, pero sin API). Por eso no se pueden subir ahora.
        </Text>
        <Text style={styles.imgText}>
          Puedes continuar: tu servicio se enviará a revisión sin fotos.
        </Text>
      </View>
    </View>
  );
}