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
  const [apretado, setApretado] = useState(false);
  const etiquetaAcceso = `${etiqueta}: ${valor ?? 'sin datos'}`;

  const cuadro = (
    <View
      style={[
        styles.statCard,
        sobre && styles.statCardHover,
        apretado && styles.statCardPressed,
      ]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}1F` }]}>
        <Ionicons name={icono} size={24} color={color} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.statValue}>{valor ?? '—'}</Text>
        <Text style={styles.statLabel} numberOfLines={2}>
          {etiqueta}
        </Text>
      </View>
    </View>
  );

  if (!onPress) {
    return (
      <View style={styles.statSlot} accessibilityLabel={etiquetaAcceso}>
        {cuadro}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setApretado(true)}
      onPressOut={() => setApretado(false)}
      onHoverIn={() => setSobre(true)}
      onHoverOut={() => setSobre(false)}
      accessibilityRole="button"
      accessibilityLabel={etiquetaAcceso}
      style={styles.statSlot}>
      {cuadro}
    </Pressable>
  );
}
