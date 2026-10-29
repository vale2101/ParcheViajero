import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  valor?: string | undefined;
  compacto?: boolean;
}

export default function InfoRow({ icono, etiqueta, valor, compacto }: Props) {
  const texto = valor || 'No especificado';

  if (compacto) {
    return (
      <View style={styles.detailLine} accessibilityLabel={`${etiqueta}: ${texto}`}>
        <Ionicons name={icono} size={18} color={colors.azul} />
        <Text style={styles.detailLineText}>{texto}</Text>
      </View>
    );
  }

  return (
    <View style={styles.infoRow}>
      <Ionicons name={icono} size={20} color={colors.azul} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{etiqueta}</Text>
        <Text style={styles.infoValue}>{texto}</Text>
      </View>
    </View>
  );
}