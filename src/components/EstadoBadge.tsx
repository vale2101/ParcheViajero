import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { EstadoAprobacion } from '../api/servicio';
import { getEstadoVisual } from '../utils/estadoServicio';
import { styles } from '../styles/Admin.styles';

export default function EstadoBadge({
  estado,
  corto,
}: {
  estado?: EstadoAprobacion | undefined;
  corto?: boolean;
}) {
  const e = getEstadoVisual(estado);
  const texto = corto && (estado ?? 'pendiente') === 'pendiente' ? 'Pendiente' : e.texto;
  return (
    <View
      style={[styles.badge, { backgroundColor: e.bg, borderColor: e.borde }]}
      accessibilityLabel={`Estado: ${e.texto}`}>
      <Ionicons name={e.icono} size={14} color={e.fg} />
      <Text style={[styles.badgeText, { color: e.fg }]}>{texto}</Text>
    </View>
  );
}