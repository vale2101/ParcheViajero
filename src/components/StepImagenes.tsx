import { Text, View } from 'react-native';
import ImagenesPicker from './ImagenesPicker';
import type { ImagenLocal } from '../api/servicio';
import { styles } from '../styles/ServicioWizard.styles';

interface Props {
  imagenes: ImagenLocal[];
  aviso: string | null;
  onAgregar: () => void;
  onQuitar: (uri: string) => void;
}

export default function StepImagenes({ imagenes, aviso, onAgregar, onQuitar }: Props) {
  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>Imágenes del servicio</Text>
      <Text style={styles.stepSubtitle}>
        Opcional. Hasta 6 fotos (JPG, PNG o WEBP, máx. 5 MB c/u). La primera será la principal.
      </Text>

      <ImagenesPicker
        fotos={imagenes.map((i) => ({ key: i.uri, uri: i.uri }))}
        aviso={aviso}
        onAgregar={onAgregar}
        onQuitar={onQuitar}
      />
    </View>
  );
}