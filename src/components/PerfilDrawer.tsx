import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/PerfilDrawer.styles';

const ANCHO_PANEL = 260;

interface Props {
  visible: boolean;
  onClose: () => void;
  onEditar: () => void;
  onAcerca: () => void;
  onTerminos: () => void;
  onCerrarSesion: () => void;
}

export default function PerfilDrawer({
  visible,
  onClose,
  onEditar,
  onAcerca,
  onTerminos,
  onCerrarSesion,
}: Props) {
  const insets = useSafeAreaInsets();

  // "mostrar" mantiene el modal abierto mientras se reproduce la animación de salida
  const [mostrar, setMostrar] = useState(visible);
  const opacidad = useRef(new Animated.Value(0)).current;
  const desplazamiento = useRef(new Animated.Value(ANCHO_PANEL)).current;

  useEffect(() => {
    if (visible) {
      setMostrar(true);
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(desplazamiento, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacidad, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(desplazamiento, {
          toValue: ANCHO_PANEL,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setMostrar(false));
    }
  }, [visible, opacidad, desplazamiento]);

  // Cierra el drawer y luego ejecuta la acción elegida
  function elegir(accion: () => void) {
    onClose();
    accion();
  }

  const opciones = [
    { icono: 'create-outline' as const, texto: 'Editar perfil', accion: onEditar },
    { icono: 'information-circle-outline' as const, texto: 'Acerca de la app', accion: onAcerca },
    { icono: 'document-text-outline' as const, texto: 'Términos y condiciones', accion: onTerminos },
  ];

  return (
    <Modal visible={mostrar} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Fondo oscuro: al tocarlo se cierra el drawer */}
        <Animated.View style={[styles.backdrop, { opacity: opacidad }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        {/* Panel que entra desde la derecha */}
        <Animated.View
          style={[
            styles.panel,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              transform: [{ translateX: desplazamiento }],
            },
          ]}>
          <View style={styles.header}>
            <Text style={styles.title}>Menú</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color="#a3a3a3" />
            </Pressable>
          </View>

          <View style={styles.options}>
            {opciones.map((op) => (
              <Pressable key={op.texto} style={styles.item} onPress={() => elegir(op.accion)}>
                <Ionicons name={op.icono} size={22} color="#0147B9" />
                <Text style={styles.itemText}>{op.texto}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.footer} onPress={() => elegir(onCerrarSesion)}>
            <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
