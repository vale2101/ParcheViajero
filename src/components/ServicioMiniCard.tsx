import { Pressable, Text, View } from 'react-native';
import Foto from './Foto';
import type { Servicio } from '../api/servicio';
import { formatearPrecioCOP } from '../utils/formatoServicio';
import { colors, radius, sombra, spacing, typography } from '../styles/theme';
import FotoPlaceholder from './FotoPlaceholder';
import StarRating from './StarRating';

interface Props {
  servicio: Servicio;
  categoria?: string;
  promedio?: number;
  onPress: () => void;
}

export default function ServicioMiniCard({ servicio, categoria, promedio, onPress }: Props) {
  const foto = servicio.imagenes?.[0]?.url_imagen;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={servicio.nombre}
      style={{
        width: 168,
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.borde,
        overflow: 'hidden',
        ...sombra,
      }}>
      {foto ? (
        <Foto uri={foto} recyclingKey={servicio._id} style={{ width: 168, height: 110 }} />
      ) : (
        <FotoPlaceholder plano categoria={categoria} style={{ width: 168, height: 110 }} />
      )}
      <View style={{ padding: spacing.md, gap: spacing.xs }}>
        <Text style={[typography.subtitulo, { fontSize: 14 }]} numberOfLines={1}>
          {servicio.nombre}
        </Text>
        {!!categoria && (
          <Text style={typography.caption} numberOfLines={1}>
            {categoria}
          </Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          {promedio !== undefined && <StarRating value={Math.round(promedio)} readonly size={12} />}
          {servicio.precio !== undefined && (
            <Text style={typography.caption}>{formatearPrecioCOP(servicio.precio)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
