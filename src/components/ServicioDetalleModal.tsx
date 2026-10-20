import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import type { Servicio } from '../api/servicio';
import { getEstadoVisual } from '../utils/estadoServicio';
import { styles } from '../styles/ServicioDetalleModal.styles';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  categoria?: string | undefined;
  municipio?: string | undefined;
  onClose: () => void;
}

function formatearPrecio(valor: number): string {
  return `$ ${Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} COP`;
}

function Fila({
  icono,
  etiqueta,
  valor,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  valor?: string | undefined;
}) {
  if (!valor) return null;

  return (
    <View style={styles.row}>
      <Ionicons name={icono} size={20} color="#0147B9" style={styles.rowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{etiqueta}</Text>
        <Text style={styles.rowValue}>{valor}</Text>
      </View>
    </View>
  );
}

export default function ServicioDetalleModal({
  visible,
  servicio,
  categoria,
  municipio,
  onClose,
}: Props) {
  if (!servicio) return null;

  const estado = getEstadoVisual(servicio.estado_aprobacion);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {}
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{servicio.nombre}</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Cerrar">
              <Ionicons name="close" size={24} color="#6b6b6b" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator>
            <View
              style={[styles.badge, { backgroundColor: estado.bg, borderColor: estado.borde }]}
              accessibilityLabel={`Estado: ${estado.texto}`}>
              <Ionicons name={estado.icono} size={16} color={estado.fg} />
              <Text style={[styles.badgeText, { color: estado.fg }]}>{estado.texto}</Text>
            </View>

            {servicio.estado_aprobacion === 'rechazado' && !!servicio.observacion_revision && (
              <View style={styles.rejectBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rejectTitle}>Observación del administrador</Text>
                  <Text style={styles.rejectText}>{servicio.observacion_revision}</Text>
                </View>
              </View>
            )}

            <Fila icono="pricetag-outline" etiqueta="Categoría" valor={categoria} />
            <Fila icono="document-text-outline" etiqueta="Descripción" valor={servicio.descripcion} />
            <Fila icono="business-outline" etiqueta="Municipio" valor={municipio} />
            <Fila icono="location-outline" etiqueta="Dirección" valor={servicio.direccion} />
            <Fila icono="call-outline" etiqueta="Teléfono" valor={servicio.telefono} />
            <Fila icono="time-outline" etiqueta="Horario de atención" valor={servicio.horario_atencion} />
            <Fila
              icono="cash-outline"
              etiqueta="Precio"
              valor={servicio.precio !== undefined ? formatearPrecio(servicio.precio) : undefined}
            />
            <Fila
              icono="calendar-outline"
              etiqueta="Fecha de registro"
              valor={
                servicio.fecha_creacion
                  ? new Date(servicio.fecha_creacion).toLocaleDateString()
                  : undefined
              }
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button text="Cerrar" onPress={onClose} secondary />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}