import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getResenasByServicio, type Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';
import { getUsuarioById } from '../api/usuario';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
  onDejarResena: () => void; // abre el ServicioReviewModal
  // Solo para pruebas sin backend (opcionales)
  resenasDemo?: Resena[];
  autorDemo?: string;
}

// "Laura Gómez" -> "Laura G."
function nombreCorto(nombre: string) {
  const partes = nombre.trim().split(' ');
  if (partes.length < 2) return nombre;
  return `${partes[0]} ${partes[1].charAt(0).toUpperCase()}.`;
}

// Convierte una fecha en "hace 2 días"
function haceCuanto(fecha?: string) {
  if (!fecha) return '';
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias} días`;
}

export default function ServicioFichaModal({
  visible,
  servicio,
  onClose,
  onDejarResena,
  resenasDemo,
  autorDemo,
}: Props) {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [autor, setAutor] = useState('Viajero');

  // --- Animación ---
  // "mostrar" mantiene el modal abierto mientras se reproduce la animación de salida
  const [mostrar, setMostrar] = useState(visible);
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      setMostrar(true);
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(subida, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(subida, { toValue: 40, duration: 180, useNativeDriver: true }),
      ]).start(() => setMostrar(false));
    }
  }, [visible, opacidad, subida]);

  // Guardamos el último servicio para que la ficha no desaparezca de golpe al cerrar
  const ultimoServicio = useRef<Servicio | null>(null);
  if (servicio) ultimoServicio.current = servicio;
  const lugar = servicio ?? ultimoServicio.current;

  // --- Reseñas ---
  useEffect(() => {
    if (!visible || !servicio) return;

    // Modo prueba: datos falsos, sin llamar al backend
    if (resenasDemo) {
      setResenas(resenasDemo);
      setAutor(autorDemo ?? 'Viajero');
      return;
    }

    getResenasByServicio(servicio._id)
      .then(({ data }) => {
        setResenas(data);

        // Nombre de quien escribió la última reseña
        const ultima = data[data.length - 1];
        if (ultima) {
          getUsuarioById(ultima.usuario_id)
            .then(({ data: u }) => setAutor(nombreCorto(u.nombre)))
            .catch(() => setAutor('Viajero'));
        }
      })
      .catch(() => setResenas([]));
  }, [visible, servicio, resenasDemo, autorDemo]);

  if (!lugar) return null;

  const promedio =
    resenas.length > 0
      ? resenas.reduce((suma, r) => suma + r.calificacion, 0) / resenas.length
      : 0;

  const ultimaResena = resenas.length > 0 ? resenas[resenas.length - 1] : null;

  function comoLlegar() {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lugar!.latitud},${lugar!.longitud}`;
    Linking.openURL(url);
  }

  return (
    <Modal visible={mostrar} animationType="none" transparent onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: opacidad }]}>
        <Animated.View style={[styles.card, { transform: [{ translateY: subida }] }]}>
          <ScrollView contentContainerStyle={styles.body}>
            {/* Título y cerrar */}
            <View style={styles.header}>
              <Text style={styles.title}>{lugar.nombre}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color="#a3a3a3" />
              </Pressable>
            </View>

            {/* Categoría y municipio (por ahora son ids) */}
            <View style={styles.tagsRow}>
              <Text style={styles.categoria}>{lugar.categoria_id}</Text>
              <Text style={styles.municipio}>{lugar.municipio_id}</Text>
            </View>

            {/* Promedio */}
            {resenas.length > 0 && (
              <Text style={styles.ratingText}>
                <Text style={styles.ratingNumero}>{promedio.toFixed(1)}</Text> · {resenas.length}{' '}
                reseñas
              </Text>
            )}

            {/* Datos de contacto con iconos de línea */}
            {!!lugar.direccion && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#737373" />
                <Text style={styles.info}>{lugar.direccion}</Text>
              </View>
            )}
            {!!lugar.horario_atencion && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color="#737373" />
                <Text style={styles.info}>{lugar.horario_atencion}</Text>
              </View>
            )}
            {!!lugar.telefono && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color="#737373" />
                <Text style={styles.info}>{lugar.telefono}</Text>
              </View>
            )}

            {!!lugar.descripcion && <Text style={styles.descripcion}>{lugar.descripcion}</Text>}

            {/* Chips de servicios */}
            {!!lugar.servicios && lugar.servicios.length > 0 && (
              <View style={styles.bloque}>
                <Text style={styles.sectionTitle}>Servicios</Text>
                <View style={styles.chipsRow}>
                  {lugar.servicios.map((s) => (
                    <View key={s} style={styles.chip}>
                      <Text style={styles.chipText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Reseñas */}
            <View style={styles.bloque}>
              <View style={styles.resenasHeader}>
                <Text style={styles.sectionTitle}>Reseñas</Text>
                <Pressable
                  onPress={onDejarResena}
                  hitSlop={8}
                  style={({ pressed }) => pressed && styles.presionado}>
                  <Text style={styles.verTodas}>Ver todas</Text>
                </Pressable>
              </View>

              {ultimaResena ? (
                <View style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewAutor}>{autor}</Text>
                    <Text style={styles.reviewFecha}>{haceCuanto(ultimaResena.fecha)}</Text>
                  </View>
                  {!!ultimaResena.comentario && (
                    <Text style={styles.reviewText}>{ultimaResena.comentario}</Text>
                  )}
                </View>
              ) : (
                <Text style={styles.placeholder}>Aún no hay reseñas para este lugar</Text>
              )}
            </View>
          </ScrollView>

          {/* Botones fijos abajo */}
          <View style={styles.footer}>
            <Pressable
              onPress={onDejarResena}
              style={({ pressed }) => [styles.footerButton, pressed && styles.presionado]}>
              <Text style={styles.footerText}>Dejar reseña</Text>
            </Pressable>
            <Pressable
              onPress={comoLlegar}
              style={({ pressed }) => [styles.footerButton, pressed && styles.presionado]}>
              <Text style={styles.footerText}>Cómo llegar</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    maxHeight: '88%',
    overflow: 'hidden',
  },
  body: { padding: 20, gap: 10 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#171717', flexShrink: 1 },
  tagsRow: { flexDirection: 'row', gap: 10 },
  categoria: { fontSize: 13, fontWeight: '700', color: '#171717' },
  municipio: { fontSize: 13, color: '#737373' },
  ratingText: { fontSize: 14, color: '#171717', marginLeft: 24 },
  ratingNumero: { fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  info: { fontSize: 14, color: '#171717', flexShrink: 1 },
  descripcion: { fontSize: 14, color: '#171717', marginTop: 6, lineHeight: 21 },
  bloque: { marginTop: 10, gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#171717' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: { fontSize: 13, color: '#171717' },
  resenasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verTodas: { fontSize: 13, fontWeight: '700', color: '#171717' },
  reviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    padding: 12,
    gap: 6,
  },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAutor: { fontSize: 14, fontWeight: '700', color: '#171717' },
  reviewFecha: { fontSize: 12, color: '#737373' },
  reviewText: { fontSize: 14, color: '#171717' },
  placeholder: { color: '#737373', fontSize: 14 },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  footerText: { fontSize: 15, fontWeight: '600', color: '#171717' },
  // Efecto al presionar un botón
  presionado: { opacity: 0.6, transform: [{ scale: 0.97 }] },
});