import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { Servicio } from '../api/servicio';
import CategoriaSticker from './CategoriaSticker';
import { formatearPrecioCOP } from '../utils/formatoServicio';
import { colors } from '../styles/theme';
import { styles } from '../styles/ServicioCard.styles';
import FotoPlaceholder from './FotoPlaceholder';
import MarcoPolaroid from './MarcoPolaroid';

interface Props {
  servicio: Servicio;
  categoria?: string | undefined;
  municipio?: string | undefined;
  ocupado: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}

const FOTO = { ancho: 86, alto: 86 };

function Fila({
  icono,
  texto,
  color = colors.textoSec,
  estilo = styles.infoText,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  texto: string;
  color?: string;
  estilo?: object;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icono} size={16} color={color} />
      <Text style={estilo} numberOfLines={1}>
        {texto}
      </Text>
    </View>
  );
}

export default function ServicioCard({
  servicio,
  categoria,
  municipio,
  ocupado,
  onEditar,
  onEliminar,
}: Props) {
  const foto = servicio.imagenes?.[0]?.url_imagen;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.polaroidWrap}>
          <MarcoPolaroid ancho={FOTO.ancho} alto={FOTO.alto} rotacion="-4deg">
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={{ width: FOTO.ancho, height: FOTO.alto }}
                contentFit="cover"
                cachePolicy="disk"
                transition={200}
                accessibilityLabel={`Foto de ${servicio.nombre}`}
              />
            ) : (
              <FotoPlaceholder plano categoria={categoria} style={{ width: FOTO.ancho, height: FOTO.alto }} />
            )}
          </MarcoPolaroid>
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {servicio.nombre}
          </Text>

          <CategoriaSticker nombre={categoria} />

          {!!municipio && <Fila icono="location" texto={municipio} color={colors.azul} />}
          {!!servicio.direccion && <Fila icono="home-outline" texto={servicio.direccion} />}
        </View>
      </View>

      {!!servicio.horario_atencion && (
        <Fila icono="time-outline" texto={servicio.horario_atencion} />
      )}
      <Fila
        icono="cash-outline"
        color="#B45309"
        estilo={styles.priceText}
        texto={
          servicio.precio !== undefined ? formatearPrecioCOP(servicio.precio) : 'Consultar precio'
        }
      />

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.btnEdit, ocupado && styles.btnDisabled]}
          onPress={onEditar}
          disabled={ocupado}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${servicio.nombre}`}>
          <Ionicons name="create-outline" size={18} color={colors.dorado} />
          <Text style={styles.btnEditText}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnDelete, ocupado && styles.btnDisabled]}
          onPress={onEliminar}
          disabled={ocupado}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar ${servicio.nombre}`}>
          <Ionicons name="trash-outline" size={18} color={colors.rojo} />
          <Text style={styles.btnDeleteText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}
