import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { ServicioAdmin } from '../api/admin';
import { formatearFecha } from '../utils/adminFormat';
import { colors } from '../styles/theme';
import EstadoBadge from './EstadoBadge';
import FotoPlaceholder from './FotoPlaceholder';
import { styles } from '../styles/Admin.styles';

function Linea({ icono, texto }: { icono: keyof typeof Ionicons.glyphMap; texto: string }) {
  return (
    <View style={styles.lineRow}>
      <Ionicons name={icono} size={14} color={colors.textoSec} />
      <Text style={styles.lineText} numberOfLines={1}>
        {texto}
      </Text>
    </View>
  );
}

export default function ServicioAdminCard({ servicio: s, onPress }: { servicio: ServicioAdmin; onPress: () => void }) {
  const pendiente = (s.estado_aprobacion ?? 'pendiente') === 'pendiente';
  const fecha = pendiente ? s.fecha_creacion : (s.fecha_revision ?? s.fecha_creacion);
  const foto = s.imagenes?.[0]?.url_imagen;

  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir ${s.nombre}`}>
      {foto ? (
        <Image
          source={{ uri: foto }}
          style={styles.cardPhoto}
          contentFit="cover"
          cachePolicy="disk"
          transition={150}
          accessibilityLabel={`Foto de ${s.nombre}`}
        />
      ) : (
        <FotoPlaceholder categoria={s.categoria_nombre} style={styles.cardPhoto} />
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {s.nombre}
        </Text>
        <EstadoBadge estado={s.estado_aprobacion} />
        {!!s.categoria_nombre && <Linea icono="pricetag-outline" texto={s.categoria_nombre} />}
        <Linea icono="location-outline" texto={s.municipio_nombre ?? 'Municipio no disponible'} />
        <Linea icono="storefront-outline" texto={s.propietario?.nombre ?? 'Negocio no disponible'} />
        <Linea icono="calendar-outline" texto={`${pendiente ? 'Enviado' : 'Revisado'}: ${formatearFecha(fecha)}`} />
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.azul} />
    </Pressable>
  );
}
