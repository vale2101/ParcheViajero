import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Field from '../components/Field';
import PickerField from '../components/PickerField';
import StepUbicacion from '../components/StepUbicacion';
import { updateServicio, type Servicio, type UpdateServicioInput } from '../api/servicio';
import type { Categoria } from '../api/categoria';
import type { Municipio } from '../api/municipio';
import { useAlert } from '../context/AlertContext';
import { useUbicacionServicio } from '../hooks/useUbicacionServicio';
import { reglaNombre } from '../utils/validaciones';
import { reglaPrecio, reglaTelefonoServicio } from '../utils/validacionesServicio';
import { styles } from '../styles/PerfilNegocio.styles';

type EditForm = {
  nombre: string;
  descripcion: string;
  telefono: string;
  horario_atencion: string;
  precio: string;
};

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  categorias: Categoria[];
  municipios: Municipio[];
  municipioActual?: string | undefined;
  onClose: () => void;
  onSaved: () => void;
}

const sinAncla = () => () => {};

export default function ServicioEditarModal({
  visible,
  servicio,
  categorias,
  municipios,
  municipioActual,
  onClose,
  onSaved,
}: Props) {
  const { errorVital } = useAlert();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const guardandoRef = useRef(false);

  const form = useForm<EditForm>({
    defaultValues: { nombre: '', descripcion: '', telefono: '', horario_atencion: '', precio: '' },
  });

  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [cambiandoUbicacion, setCambiandoUbicacion] = useState(false);
  const [errorCategoria, setErrorCategoria] = useState<string | undefined>();
  const [errorUbicacion, setErrorUbicacion] = useState<string | undefined>();
  const [errorMunicipio, setErrorMunicipio] = useState<string | undefined>();
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const ubicacion = useUbicacionServicio();
  const { confirmada, reiniciar } = ubicacion;

  useEffect(() => {
    if (!visible || !servicio) return;
    form.reset({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion ?? '',
      telefono: servicio.telefono ?? '',
      horario_atencion: servicio.horario_atencion ?? '',
      precio: servicio.precio !== undefined ? String(Math.round(servicio.precio)) : '',
    });
    setCategoriaId(servicio.categoria_id);
    setMunicipioId(servicio.municipio_id);
    setCambiandoUbicacion(false);
    setErrorCategoria(undefined);
    setErrorUbicacion(undefined);
    setErrorMunicipio(undefined);
    setErrorEnvio(null);
    reiniciar(null);
  }, [visible, servicio?._id]);

  useEffect(() => {
    if (confirmada) setErrorUbicacion(undefined);
  }, [confirmada]);

  if (!servicio) return null;

  const nombreMunicipio = (id: string | null) => municipios.find((m) => m._id === id)?.nombre ?? null;

  function empezarCambioUbicacion() {
    setCambiandoUbicacion(true);
    setMunicipioId(servicio!.municipio_id);
    reiniciar(nombreMunicipio(servicio!.municipio_id));
  }

  function cancelarCambioUbicacion() {
    setCambiandoUbicacion(false);
    setMunicipioId(servicio!.municipio_id);
    setErrorUbicacion(undefined);
    setErrorMunicipio(undefined);
    reiniciar(null);
  }

  function seleccionarMunicipio(id: string) {
    if (id === municipioId) return;
    setMunicipioId(id);
    setErrorMunicipio(undefined);
    setErrorUbicacion(undefined);
    reiniciar(nombreMunicipio(id));
  }

  function cerrar() {
    if (guardandoRef.current) return;
    onClose();
  }

  const guardar = form.handleSubmit(
    async (v) => {
      setErrorEnvio(null);

      if (!categoriaId) {
        setErrorCategoria('Selecciona una categoría');
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
      if (cambiandoUbicacion) {
        if (!municipioId) {
          setErrorMunicipio('Selecciona el municipio del servicio');
          return;
        }
        if (!confirmada) {
          setErrorUbicacion('Busca la dirección en el mapa y confirma la ubicación para guardar');
          return;
        }
      }
      if (guardandoRef.current) return;

      const cambios: UpdateServicioInput = {
        categoria_id: categoriaId,
        nombre: v.nombre.trim(),
        descripcion: v.descripcion.trim(),
        telefono: v.telefono.trim(),
        horario_atencion: v.horario_atencion.trim(),
      };
      if (v.precio) cambios.precio = Number(v.precio);
      if (cambiandoUbicacion && municipioId && confirmada) {
        cambios.municipio_id = municipioId;
        cambios.direccion = confirmada.direccion;
        cambios.latitud = confirmada.latitud;
        cambios.longitud = confirmada.longitud;
      }

      guardandoRef.current = true;
      setGuardando(true);
      try {
        await updateServicio(servicio._id, cambios);
        onSaved();
        onClose();
      } catch (e) {
        setErrorEnvio(
          errorVital(
            'No se pudieron guardar los cambios del servicio',
            e,
            'Error en la base de datos. Inténtalo más tarde.',
            'No se pudo guardar',
          ),
        );
      } finally {
        guardandoRef.current = false;
        setGuardando(false);
      }
    },
    () => scrollRef.current?.scrollTo({ y: 0, animated: true }),
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={cerrar}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.sheetBackdrop, { paddingTop: insets.top + 12 }]}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Editar servicio</Text>
              <Pressable
                style={styles.closeBtn}
                onPress={cerrar}
                accessibilityRole="button"
                accessibilityLabel="Cerrar">
                <Ionicons name="close" size={24} color="#6b6b6b" />
              </Pressable>
            </View>

            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.cardForm}
              keyboardShouldPersistTaps="handled">
              <Field
                control={form.control}
                name="nombre"
                label="Nombre"
                placeholder="Ej. Café La Cima"
                autoCapitalize="sentences"
                rules={reglaNombre}
              />

              <Field
                control={form.control}
                name="descripcion"
                label="Descripción (opcional)"
                placeholder="Cuéntale a los viajeros qué ofreces"
                autoCapitalize="sentences"
                multiline
                numberOfLines={3}
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />

              <View style={{ gap: 4 }}>
                <PickerField
                  label="Categoría"
                  value={categoriaId}
                  options={categorias.map((c) => ({ id: c._id, nombre: c.nombre }))}
                  onChange={(id) => {
                    setCategoriaId(id);
                    setErrorCategoria(undefined);
                  }}
                  placeholder="Selecciona una categoría"
                  error={errorCategoria}
                />
              </View>

              <Field
                control={form.control}
                name="telefono"
                label="Teléfono (opcional)"
                placeholder="3001234567"
                keyboardType="phone-pad"
                rules={reglaTelefonoServicio}
              />

              <Field
                control={form.control}
                name="horario_atencion"
                label="Horario de atención (opcional)"
                placeholder="Lun a dom, 8am - 8pm"
                autoCapitalize="sentences"
              />

              <View style={{ gap: 4 }}>
                <Field
                  control={form.control}
                  name="precio"
                  label="Precio (opcional)"
                  placeholder="25000"
                  keyboardType="number-pad"
                  rules={reglaPrecio}
                />
                <Text style={styles.fieldHelp}>Pesos colombianos (COP), solo números.</Text>
              </View>

              <Text style={styles.sectionTitle}>Ubicación</Text>

              {!cambiandoUbicacion ? (
                <View style={styles.currentLoc}>
                  <Text style={styles.currentLocText}>
                    {[servicio.direccion, municipioActual].filter(Boolean).join(' · ') ||
                      'Sin dirección registrada'}
                  </Text>
                  <Button text="Cambiar ubicación" onPress={empezarCambioUbicacion} secondary />
                </View>
              ) : (
                <>
                  <StepUbicacion
                    municipios={municipios}
                    cargando={false}
                    error={null}
                    onReintentar={() => {}}
                    municipioId={municipioId}
                    municipioNombre={nombreMunicipio(municipioId) ?? undefined}
                    onSeleccionarMunicipio={seleccionarMunicipio}
                    ubicacion={ubicacion}
                    errorMunicipio={errorMunicipio}
                    errorUbicacion={errorUbicacion}
                    ancla={sinAncla}
                  />
                  <Button
                    text="Mantener la ubicación actual"
                    onPress={cancelarCambioUbicacion}
                    secondary
                  />
                </>
              )}

              {!!errorEnvio && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorBoxText}>{errorEnvio}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.cardFooter}>
              <Button
                text="Cancelar"
                onPress={cerrar}
                secondary
                disabled={guardando}
                style={styles.footerBtn}
              />
              <Button
                text={guardando ? 'Guardando…' : 'Guardar cambios'}
                onPress={guardar}
                disabled={guardando}
                style={styles.footerBtn}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}