import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Servicio } from '../api/servicio';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { formatearPrecioCOP } from '../utils/formatoServicio';
import { styles } from '../styles/ServicioCard.styles';

interface Props {
  servicio: Servicio;
  categoria?: string | undefined;
  municipio?: string | undefined;
  ocupado: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}

function Fila({
  icono,
  texto,
  color = '#6b6b6b',
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
  const visual = getCategoriaVisual(categoria);

  return (
    <View style={styles.card}>
      {}
      <View
        style={[styles.photo, { backgroundColor: `${visual.color}1A` }]}
        accessibilityLabel="Imagen predeterminada del servicio">
        <Text style={styles.photoEmoji}>{visual.emoji}</Text>
        <Text style={styles.photoHint}>Sin fotografía</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {servicio.nombre}
        </Text>

        {!!categoria && (
          <View style={[styles.badge, { backgroundColor: `${visual.color}1A` }]}>
            <Text style={[styles.badgeText, { color: visual.color }]}>
              {visual.emoji} {categoria}
            </Text>
          </View>
        )}

        {!!municipio && <Fila icono="location" texto={municipio} color="#0147B9" />}
        {!!servicio.direccion && <Fila icono="home-outline" texto={servicio.direccion} />}
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
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.btnEdit, ocupado && styles.btnDisabled]}
          onPress={onEditar}
          disabled={ocupado}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${servicio.nombre}`}>
          <Ionicons name="create-outline" size={18} color="#FEBA03" />
          <Text style={styles.btnEditText}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnDelete, ocupado && styles.btnDisabled]}
          onPress={onEliminar}
          disabled={ocupado}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar ${servicio.nombre}`}>
          <Ionicons name="trash-outline" size={18} color="#B91C1C" />
          <Text style={styles.btnDeleteText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}