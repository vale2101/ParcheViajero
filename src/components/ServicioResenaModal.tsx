import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Linking, Modal, Pressable, Text, View } from 'react-native';
import type { Categoria } from '../api/categoria';
import type { Municipio } from '../api/municipio';
import { getResenasByServicio, type Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';
import { useAuth } from '../context/AuthContext';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { MENSAJE_ERROR_DATOS } from '../utils/errorApp';
import { nombreAutorResena } from '../utils/resenaAutor';
import { colors } from '../styles/theme';
import { styles } from '../styles/ServicioResenaModal.styles';
import Button from './Button';
import { SkeletonListItem } from './Skeleton';
import ReviewItem from './ReviewItem';
import StarRating from './StarRating';

interface Props {
  visible: boolean;
  servicio: Servicio | null;
  onClose: () => void;
  onDejarResena: () => void;
  mostrarAccionResena?: boolean;
  categorias?: Categoria[];
  municipios?: Municipio[];
  resenasDemo?: Resena[];
}

function pareceId(valor?: string) {
  return !!valor && /^[a-f0-9]{24}$/i.test(valor);
}

function FilaDato({
  icono,
  etiqueta,
  valor,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  etiqueta: string;
  valor?: string;
}) {
  if (!valor) return null;
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icono} size={18} color={colors.azul} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{etiqueta}</Text>
        <Text style={styles.infoValue}>{valor}</Text>
      </View>
    </View>
  );
}

function SeparadorResena() {
  return <View style={styles.separador} />;
}

function ListaResenasVacia() {
  return <Text style={styles.placeholder}>Aún no hay reseñas. ¡Sé el primero en opinar!</Text>;
}

export default function ServicioFichaModal({
  visible,
  servicio,
  onClose,
  onDejarResena,
  mostrarAccionResena = true,
  categorias = [],
  municipios = [],
  resenasDemo,
}: Props) {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrar, setMostrar] = useState(visible);
  const opacidad = useRef(new Animated.Value(0)).current;
  const subida = useRef(new Animated.Value(40)).current;

  const ultimoServicio = useRef<Servicio | null>(null);
  if (servicio) ultimoServicio.current = servicio;
  const lugar = servicio ?? ultimoServicio.current;

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

  const cargar = useCallback(
    async (esRefresh = false) => {
      if (!servicio) return;

      if (resenasDemo) {
        setResenas(resenasDemo);
        setError(null);
        setCargando(false);
        setRefrescando(false);
        return;
      }

      if (esRefresh) {
        setRefrescando(true);
      } else {
        setCargando(true);
      }
      setError(null);

      try {
        const { data } = await getResenasByServicio(servicio._id);
        setResenas(data);
      } catch {
        setError(MENSAJE_ERROR_DATOS);
        if (!esRefresh) {
          setResenas([]);
        }
      } finally {
        setCargando(false);
        setRefrescando(false);
      }
    },
    [servicio, resenasDemo],
  );

  useEffect(() => {
    if (!visible || !servicio) return;
    void cargar(false);
  }, [visible, servicio, cargar]);

  const categoriaNombre = useMemo(() => {
    const porId = categorias.find((c) => c._id === lugar?.categoria_id)?.nombre;
    if (porId) return porId;
    const raw = lugar?.categoria_id;
    return raw && !pareceId(raw) ? raw : undefined;
  }, [categorias, lugar?.categoria_id]);

  const municipioNombre = useMemo(() => {
    const porId = municipios.find((m) => m._id === lugar?.municipio_id)?.nombre;
    if (porId) return porId;
    const raw = lugar?.municipio_id;
    return raw && !pareceId(raw) ? raw : undefined;
  }, [municipios, lugar?.municipio_id]);

  const ordenadas = useMemo(
    () =>
      [...resenas].sort(
        (a, b) => new Date(b.fecha ?? 0).getTime() - new Date(a.fecha ?? 0).getTime(),
      ),
    [resenas],
  );

  const promedio =
    ordenadas.length > 0
      ? ordenadas.reduce((suma, r) => suma + r.calificacion, 0) / ordenadas.length
      : 0;

  const visual = getCategoriaVisual(categoriaNombre);
  const foto = lugar?.imagenes?.[0]?.url_imagen;

  function comoLlegar() {
    if (!lugar) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lugar.latitud},${lugar.longitud}`;
    Linking.openURL(url);
  }

  const extraerClave = useCallback((item: Resena) => item._id, []);

  const renderResena = useCallback(
    ({ item }: { item: Resena }) => (
      <ReviewItem
        autor={nombreAutorResena(item, user)}
        calificacion={item.calificacion}
        fecha={item.fecha}
        comentario={item.comentario}
      />
    ),
    [user],
  );

  const cabecera = useMemo(() => {
    if (!lugar) return null;
    return (
      <View style={styles.cabecera}>
        <View style={styles.header}>
          <Text style={styles.title}>{lugar.nombre}</Text>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Cerrar">
            <Ionicons name="close" size={20} color={colors.textoSec} />
          </Pressable>
        </View>

        {!!foto && (
          <Image
            source={{ uri: foto }}
            style={styles.photo}
            contentFit="cover"
            accessibilityLabel={`Foto de ${lugar.nombre}`}
          />
        )}

        {(categoriaNombre || municipioNombre) && (
          <View style={styles.tagsRow}>
            {!!categoriaNombre && (
              <View style={[styles.chip, { backgroundColor: `${visual.color}1A`, borderColor: visual.color }]}>
                <Text style={[styles.chipText, { color: visual.color }]}>
                  {visual.emoji} {categoriaNombre}
                </Text>
              </View>
            )}
            {!!municipioNombre && (
              <View style={[styles.chip, { backgroundColor: colors.doradoSuave, borderColor: colors.dorado }]}>
                <Text style={[styles.chipText, { color: colors.doradoTexto }]}>{municipioNombre}</Text>
              </View>
            )}
          </View>
        )}

        {ordenadas.length > 0 && (
          <View style={styles.ratingRow}>
            <StarRating value={Math.round(promedio)} readonly size={16} />
            <Text style={styles.ratingNumero}>{promedio.toFixed(1)}</Text>
            <Text style={styles.ratingMeta}>
              · {ordenadas.length} {ordenadas.length === 1 ? 'reseña' : 'reseñas'}
            </Text>
          </View>
        )}

        {(lugar.direccion || lugar.horario_atencion || lugar.telefono) && (
          <View style={styles.sectionCard}>
            <FilaDato icono="location-outline" etiqueta="Dirección" valor={lugar.direccion} />
            <FilaDato icono="time-outline" etiqueta="Horario" valor={lugar.horario_atencion} />
            <FilaDato icono="call-outline" etiqueta="Teléfono" valor={lugar.telefono} />
          </View>
        )}

        {!!lugar.descripcion && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Sobre este lugar</Text>
            <Text style={styles.descripcion}>{lugar.descripcion}</Text>
          </View>
        )}

        <View style={styles.resenasHeader}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
        </View>

        {cargando && (
          <View style={{ gap: 12, paddingVertical: 8 }}>
            <SkeletonListItem />
            <SkeletonListItem />
          </View>
        )}

        {!!error && !cargando && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Button text="Volver a intentar" onPress={() => void cargar(false)} secondary />
          </View>
        )}
      </View>
    );
  }, [
    lugar,
    onClose,
    foto,
    categoriaNombre,
    municipioNombre,
    visual.color,
    visual.emoji,
    ordenadas.length,
    promedio,
    cargando,
    error,
    cargar,
  ]);

  const vacio =
    !cargando && !error
      ? ListaResenasVacia
      : undefined;

  if (!lugar) return null;

  const lista = cargando || error ? [] : ordenadas;

  return (
    <Modal visible={mostrar} animationType="none" transparent onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: opacidad }]}>
        <Animated.View style={[styles.card, { transform: [{ translateY: subida }] }]}>
          <FlatList
            data={lista}
            keyExtractor={extraerClave}
            renderItem={renderResena}
            ItemSeparatorComponent={SeparadorResena}
            ListHeaderComponent={cabecera as any}
            ListEmptyComponent={vacio as any}
            style={styles.scroll}
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshing={refrescando}
            onRefresh={() => void cargar(true)}
          />

          <View style={styles.footer}>
            {mostrarAccionResena && user && (
              <Pressable
                onPress={onDejarResena}
                style={({ pressed }) => [
                  styles.footerButton,
                  styles.botonSecundario,
                  pressed && styles.presionado,
                ]}>
                <Text style={styles.textoSecundario}>Dejar reseña</Text>
              </Pressable>
            )}
            <Pressable
              onPress={comoLlegar}
              style={({ pressed }) => [
                styles.footerButton,
                styles.botonPrimario,
                pressed && styles.presionado,
              ]}>
              <Text style={styles.textoPrimario}>Cómo llegar</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
