import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Municipio } from '../api/municipio';
import { colors, radius, spacing, typography } from '../styles/theme';
import DecoRutaCinta from './DecoRutaCinta';
import MontanasDeco from './MontanasDeco';

interface Props {
  visible: boolean;
  municipios: Municipio[];
  seleccionadoId: string | null;
  onCerrar: () => void;
  onElegir: (id: string | null) => void;
}

export default function HojaMunicipio({
  visible,
  municipios,
  seleccionadoId,
  onCerrar,
  onElegir,
}: Props) {
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(48)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(subida, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]).start();
    } else {
      opacidad.setValue(0);
      subida.setValue(48);
    }
  }, [visible, opacidad, subida]);

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onCerrar}>
      <View style={estilos.fondo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCerrar} accessibilityLabel="Cerrar" />
        <Animated.View style={[estilos.velo, { opacity: opacidad }]} pointerEvents="none" />
        <Animated.View style={[estilos.hoja, { transform: [{ translateY: subida }] }]}>
          <View style={estilos.cabecera}>
            <Text style={typography.subtitulo}>¿Por dónde se te antoja el parche?</Text>
            <Text style={[typography.caption, { marginTop: 4, maxWidth: '68%' }]}>
              Filtra por municipio de Caldas
            </Text>
            <View style={estilos.cinta} pointerEvents="none">
              <DecoRutaCinta />
            </View>
            <MontanasDeco />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Opcion
              nombre="Todos los municipios"
              activa={!seleccionadoId}
              onPress={() => onElegir(null)}
            />
            {municipios.map((m) => (
              <Opcion
                key={m._id}
                nombre={m.nombre}
                activa={seleccionadoId === m._id}
                onPress={() => onElegir(m._id)}
              />
            ))}
            <View style={{ height: spacing.xxl }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Opcion({
  nombre,
  activa,
  onPress,
}: {
  nombre: string;
  activa: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={estilos.opcion} accessibilityRole="button">
      <Text style={[estilos.opcionTexto, activa && estilos.opcionActiva]}>
        {activa ? `📍 ${nombre}` : nombre}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'flex-end' },
  velo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 59, 121, 0.4)',
  },
  hoja: {
    backgroundColor: colors.crema,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    maxHeight: '62%',
    overflow: 'hidden',
  },
  cabecera: {
    minHeight: 88,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  cinta: { position: 'absolute', right: -4, top: -4 },
  opcion: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borde,
  },
  opcionTexto: { fontSize: 15, color: colors.texto },
  opcionActiva: { color: colors.azul, fontWeight: '700' },
});
