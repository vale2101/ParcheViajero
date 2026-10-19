import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Admin.styles';

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  valor?: string | undefined;
}

export default function InfoRow({ icono, etiqueta, valor }: Props) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icono} size={20} color="#0147B9" style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{etiqueta}</Text>
        <Text style={styles.infoValue}>{valor || 'No especificado'}</Text>
      </View>
    </View>
  );
}