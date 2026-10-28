import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ResenaAdmin } from '../api/admin';
import { formatearFechaHora } from '../utils/adminFormat';
import StarRating from '../components/StarRating';
import { styles } from '../styles/Admin.styles';

interface Props {
  resena: ResenaAdmin;
  ocupado: boolean;
  onEliminar: () => void;
}

export default function ResenaAdminCard({ resena: r, ocupado, onEliminar }: Props) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHead}>
        <StarRating value={r.calificacion} readonly size={18} />
        <Text style={styles.infoLabel}>{formatearFechaHora(r.fecha)}</Text>
      </View>

      <View style={styles.lineRow}>
        <Ionicons name="storefront-outline" size={14} color="#6b6b6b" />
        <Text style={styles.cardName} numberOfLines={1}>
          {r.servicio_nombre ?? 'Servicio eliminado'}
        </Text>
      </View>

      <View style={styles.lineRow}>
        <Ionicons name="person-outline" size={14} color="#6b6b6b" />
        <Text style={styles.lineText} numberOfLines={1}>
          {r.autor_nombre ?? 'Usuario eliminado'}
          {r.autor_email ? ` · ${r.autor_email}` : ''}
        </Text>
      </View>

      {r.comentario ? (
        <Text style={styles.reviewComment}>{r.comentario}</Text>
      ) : (
        <Text style={styles.reviewEmpty}>Sin comentario</Text>
      )}

      <Pressable
        style={[styles.btnDeleteSmall, ocupado && styles.btnDisabled]}
        onPress={onEliminar}
        disabled={ocupado}
        accessibilityRole="button"
        accessibilityLabel="Eliminar reseña">
        <Ionicons name="trash-outline" size={18} color="#B91C1C" />
        <Text style={styles.btnDeleteSmallText}>Eliminar</Text>
      </Pressable>
    </View>
  );
}