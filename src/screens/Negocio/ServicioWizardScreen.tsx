import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import StepBasica from '../../components/StepBasica';
import StepContacto from '../../components/StepContacto';
import StepImagenes from '../../components/StepImagenes';
import StepResumen from '../../components/StepResumen';
import StepUbicacion from '../../components/StepUbicacion';
import WizardProgress from '../../components/WizardProgress';
import { TOTAL_PASOS, useServicioWizard } from '../../hooks/useServicioWizard';
import { styles } from '../../styles/ServicioWizard.styles';

function Contenido() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const w = useServicioWizard();

  const anim = useRef(new Animated.Value(1)).current;
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    w.scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [w.paso, anim, w.scrollRef]);

  const salir = () => router.replace('/negocio/servicios');

  const hayDatos =
    w.form.formState.isDirty ||
    !!w.categoriaId ||
    !!w.municipioId ||
    !!w.ubicacion.texto ||
    w.imagenes.length > 0;

  const intentarSalir = () => {
    if (hayDatos && !w.enviado) setConfirmandoSalida(true);
    else salir();
  };

  const ultimo = w.paso === TOTAL_PASOS - 1;

  function renderPaso() {
    switch (w.paso) {
      case 0:
        return (
          <StepBasica
            control={w.form.control}
            categorias={w.categorias}
            cargando={w.cargandoCatalogos}
            error={w.errorCatalogos}
            onReintentar={w.cargarCatalogos}
            categoriaId={w.categoriaId}
            onSeleccionarCategoria={w.seleccionarCategoria}
            errorCategoria={w.errores.categoria}
            ancla={w.ancla}
          />
        );
      case 1:
        return (
          <StepUbicacion
            municipios={w.municipios}
            cargando={w.cargandoCatalogos}
            error={w.errorCatalogos}
            onReintentar={w.cargarCatalogos}
            municipioId={w.municipioId}
            municipioNombre={w.municipioSeleccionado?.nombre}
            onSeleccionarMunicipio={w.seleccionarMunicipio}
            ubicacion={w.ubicacion}
            errorMunicipio={w.errores.municipio}
            errorUbicacion={w.errores.ubicacion}
            ancla={w.ancla}
          />
        );
      case 2:
        return (
          <StepContacto
            control={w.form.control}
            gratuito={w.gratuito}
            onGratuito={w.cambiarGratuito}
            ancla={w.ancla}
          />
        );
      case 3:
        return (
          <StepImagenes
            imagenes={w.imagenes}
            aviso={w.avisoImagenes}
            onAgregar={w.agregarImagenes}
            onQuitar={w.quitarImagen}
          />
        );
      default:
        return (
          <StepResumen
            valores={w.valores}
            categoria={w.categoriaSeleccionada}
            municipio={w.municipioSeleccionado}
            gratuito={w.gratuito}
            ubicacion={w.ubicacion.confirmada}
            imagenes={w.imagenes.length}
            onEditar={w.irAPaso}
            errorEnvio={w.errorEnvio}
          />
        );
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.iconBtn}
          onPress={intentarSalir}
          accessibilityRole="button"
          accessibilityLabel="Cerrar el asistente">
          <Ionicons name="close" size={26} color="#0147B9" />
        </Pressable>
        <Text style={styles.topTitle}>Añadir servicio</Text>
        <View style={styles.iconBtn} />
      </View>

      {confirmandoSalida && (
        <View style={styles.exitBox}>
          <Text style={styles.exitText}>
            ¿Salir del asistente? Perderás la información que has diligenciado.
          </Text>
          <View style={styles.exitRow}>
            <Button
              text="Seguir aquí"
              onPress={() => setConfirmandoSalida(false)}
              secondary
              style={styles.footerBtn}
            />
            <Button text="Sí, salir" onPress={salir} style={styles.footerBtn} />
          </View>
        </View>
      )}

      {w.enviado ? (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={72} color="#059669" />
          <Text style={styles.successTitle}>¡Servicio enviado a revisión!</Text>
          <Text style={styles.successText}>
            Tu servicio quedó como «Pendiente de aprobación». Todavía no está publicado: aparecerá
            en el mapa cuando un administrador lo apruebe.
          </Text>
          {!!w.errorImagenes && <Text style={styles.errorText}>{w.errorImagenes}</Text>}
          <Button text="Ver mis servicios" onPress={salir} style={{ alignSelf: 'stretch' }} />
        </View>
      ) : (
        <>
          <WizardProgress paso={w.paso} onIr={w.irAPaso} />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              ref={w.scrollRef}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator>
              <Animated.View
                style={{
                  opacity: anim,
                  transform: [
                    {
                      translateX: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [w.direccionAnim * 24, 0],
                      }),
                    },
                  ],
                }}>
                {renderPaso()}
              </Animated.View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
              {w.paso > 0 && (
                <Button
                  text="Anterior"
                  onPress={w.anterior}
                  secondary
                  disabled={w.enviando}
                  style={styles.footerBtn}
                />
              )}
              {ultimo ? (
                <Button
                  text={w.enviando ? 'Enviando…' : 'Enviar a aprobación'}
                  onPress={w.enviar}
                  disabled={w.enviando}
                  style={styles.footerBtn}
                />
              ) : (
                <Button text="Continuar" onPress={w.siguiente} style={styles.footerBtn} />
              )}
            </View>
          </KeyboardAvoidingView>

          {w.enviando && (
            <View
              style={{ position: 'absolute', top: insets.top + 60, alignSelf: 'center' }}
              pointerEvents="none">
              <ActivityIndicator color="#0147B9" />
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default function ServicioWizardScreen() {
  const [activa, setActiva] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setActiva(true);
      return () => setActiva(false);
    }, []),
  );

  return activa ? <Contenido /> : null;
}