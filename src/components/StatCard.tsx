import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Admin.styles';

interface Props {
  icono: keyof typeof Ionicons.glyphMap;
  color: string;
  valor: number | null;
  etiqueta: string;
  onPress?: () => void;
}

export default function StatCard({ icono, color, valor, etiqueta, onPress }: Props) {
  const [sobre, setSobre] = useState(false);
  const etiquetaAcceso = `${etiqueta}: ${valor ?? 'sin datos'}`;
  const contenido = (
    <>
      <View style={[styles.statIcon, { backgroundColor: `${color}1F` }]}>
        <Ionicons name={icono} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statValue}>{valor ?? '—'}</Text>
        <Text style={styles.statLabel}>{etiqueta}</Text>
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View style={styles.statCard} accessibilityLabel={etiquetaAcceso}>
        {contenido}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setSobre(true)}
      onHoverOut={() => setSobre(false)}
      accessibilityRole="button"
      accessibilityLabel={etiquetaAcceso}
      style={({ pressed }) => [
        styles.statCard,
        sobre && styles.statCardHover,
        pressed && styles.statCardPressed,
      ]}>
      {contenido}
    </Pressable>
  );
}
