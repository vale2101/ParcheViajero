import { Pressable, StyleSheet, Text } from 'react-native';
import type { Servicio } from '../api/servicio';

interface Props {
  servicio: Servicio;
  onPress: () => void;
}

export default function ServicioCard({ servicio, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{servicio.nombre}</Text>
      {!!servicio.direccion && <Text style={styles.cardSubtitle}>{servicio.direccion}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1E3A8A' },
  cardSubtitle: { fontSize: 13, color: '#a3a3a3', marginTop: 4 },
});
