import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { UsuarioAdmin } from '../api/admin';
import { ETIQUETA_TIPO, formatearFecha, iniciales } from '../utils/adminFormat';
import { styles } from '../styles/Admin.styles';

export default function UsuarioCard({ usuario: u, onPress }: { usuario: UsuarioAdmin; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir ${u.nombre}`}>
      <View style={styles.userAvatar}>
        {u.foto_perfil ? (
          <Image source={{ uri: u.foto_perfil }} style={{ width: 56, height: 56 }} />
        ) : (
          <Text style={styles.avatarText}>{iniciales(u.nombre)}</Text>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {u.nombre}
        </Text>
        <View style={styles.lineRow}>
          <Ionicons name="mail-outline" size={14} color="#6b6b6b" />
          <Text style={styles.lineText} numberOfLines={1}>
            {u.email}
          </Text>
        </View>
        <View style={styles.lineRow}>
          <Ionicons name="calendar-outline" size={14} color="#6b6b6b" />
          <Text style={styles.lineText}>Registro: {formatearFecha(u.fecha_registro)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#E8F0FD', borderColor: '#0147B9' }]}>
          <Ionicons name={u.tipo_usuario === 'negocio' ? 'storefront-outline' : 'person-outline'} size={13} color="#0147B9" />
          <Text style={[styles.badgeText, { color: '#0147B9' }]}>
            {ETIQUETA_TIPO[u.tipo_usuario]}
            {u.tipo_usuario === 'negocio' ? ` · ${u.total_servicios ?? 0} servicios` : ''}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#0147B9" />
    </Pressable>
  );
}