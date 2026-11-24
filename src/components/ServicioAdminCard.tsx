import { Pressable, Text, View } from 'react-native';
import Foto from './Foto';
import { Ionicons } from '@expo/vector-icons';
import type { ServicioAdmin } from '../api/admin';
import { formatearFecha } from '../utils/adminFormat';
import { colors } from '../styles/theme';
import CategoriaSticker from './CategoriaSticker';
import EstadoBadge from './EstadoBadge';
import FotoPlaceholder from './FotoPlaceholder';
import MarcoPolaroid from './MarcoPolaroid';
import { styles } from '../styles/Admin.styles';

function Linea({ icono, texto }: { icono: keyof typeof Ionicons.glyphMap; texto: string }) {
  return (
    <View style={styles.lineRow}>
      <Ionicons name={icono} size={14} color={colors.azul} />
      <Text style={styles.lineText} numberOfLines={1}>
        {texto}
      </Text>
    </View>
  );
}

export default function ServicioAdminCard({
  servicio: s,
  onPress,
  onEliminar,
  ocupado = false,
}: {
  servicio: ServicioAdmin;
  onPress: () => void;
  onEliminar?: () => void;
  ocupado?: boolean;
}) {
  const pendiente = (s.estado_aprobacion ?? 'pendiente') === 'pendiente';
  const fecha = pendiente ? s.fecha_creacion : (s.fecha_revision ?? s.fecha_creacion);
  const foto = s.imagenes?.[0]?.url_imagen;

  return (
    <View style={styles.card}>
      <Pressable style={styles.cardMain} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir ${s.nombre}`}>
      <MarcoPolaroid ancho={74} alto={74} rotacion="-5deg" style={{ marginLeft: 2 }}>
        {foto ? (
          <Foto
            uri={foto}
            recyclingKey={s._id}
            style={styles.polaroidFoto}
            accessibilityLabel={`Foto de ${s.nombre}`}
          />
        ) : (
          <FotoPlaceholder categoria={s.categoria_nombre} plano />
        )}
      </MarcoPolaroid>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardName} numberOfLines={2}>
            {s.nombre}
          </Text>
          <EstadoBadge estado={s.estado_aprobacion} corto />
        </View>
        <CategoriaSticker nombre={s.categoria_nombre} />
        <Linea icono="location-outline" texto={s.municipio_nombre ?? 'Municipio no disponible'} />
        <Linea icono="storefront-outline" texto={s.propietario?.nombre ?? 'Negocio no disponible'} />
        <Linea icono="calendar-outline" texto={`${pendiente ? 'Enviado' : 'Revisado'}: ${formatearFecha(fecha)}`} />
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.azul} />
      </Pressable>
      {onEliminar ? (
        <Pressable
          style={[styles.iconDanger, ocupado && styles.btnDisabled]}
          onPress={onEliminar}
          disabled={ocupado}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar ${s.nombre}`}>
          <Ionicons name="trash-outline" size={18} color={colors.rojo} />
        </Pressable>
      ) : null}
    </View>
  );
}
