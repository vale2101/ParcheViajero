import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Admin.styles';

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  valor: number | null;
  etiqueta: string;
}

export default function StatCard({ icono, color, valor, etiqueta }: Props) {
  return (
    <View style={styles.statCard} accessibilityLabel={`${etiqueta}: ${valor ?? 'sin datos'}`}>
      <View style={[styles.statIcon, { backgroundColor: `${color}1F` }]}>
        <Ionicons name={icono} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statValue}>{valor ?? '—'}</Text>
        <Text style={styles.statLabel}>{etiqueta}</Text>
      </View>
    </View>
  );
}
