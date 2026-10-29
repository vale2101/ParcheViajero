import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import Button from '../../components/Button';
import CategoriaSticker from '../../components/CategoriaSticker';
import FotoPlaceholder from '../../components/FotoPlaceholder';
import Loader from '../../components/Loader';
import MarcoPolaroid from '../../components/MarcoPolaroid';
import ScreenHeader from '../../components/ScreenHeader';
import ServicioDetalleModal from '../../components/ServicioDetalleModal';
import { useMisServicios } from '../../hooks/useMisServicios';
import type { Servicio } from '../../api/servicio';
import { getEstadoVisual } from '../../utils/estadoServicio';
import { colors } from '../../styles/theme';
import { styles } from '../../styles/NegocioServicios.styles';

const FOTO = { ancho: 74, alto: 74 };

export default function ServiciosScreen() {
  const router = useRouter();
  const { servicios, categoriasPorId, municipiosPorId, cargando, cargado, error, recargar } =
    useMisServicios();
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  const irANuevo = () => router.push('/negocio/nuevo-servicio');

  function renderTarjeta(item: Servicio) {
    const estado = getEstadoVisual(item.estado_aprobacion);
    const categoria = categoriasPorId[item.categoria_id];
    const municipio = municipiosPorId[item.municipio_id];
    const ubicacion = [item.direccion, municipio].filter(Boolean).join(' · ');
    const foto = item.imagenes?.[0]?.url_imagen;

    return (
      <Pressable
        style={styles.card}
        onPress={() => setSeleccionado(item)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${item.nombre}`}>
        <View style={styles.polaroidWrap}>
          <MarcoPolaroid ancho={FOTO.ancho} alto={FOTO.alto} rotacion="-4deg">
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={{ width: FOTO.ancho, height: FOTO.alto }}
                contentFit="cover"
                cachePolicy="disk"
                accessibilityLabel={`Foto de ${item.nombre}`}
              />
            ) : (
              <FotoPlaceholder plano categoria={categoria} style={{ width: FOTO.ancho, height: FOTO.alto }} />
            )}
          </MarcoPolaroid>
        </View>
        <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>

        <View
          style={[styles.badge, { backgroundColor: estado.bg, borderColor: estado.borde }]}
          accessibilityLabel={`Estado: ${estado.texto}`}>
          <Ionicons name={estado.icono} size={16} color={estado.fg} />
          <Text style={[styles.badgeText, { color: estado.fg }]}>{estado.texto}</Text>
        </View>

        <CategoriaSticker nombre={categoria} />

        {!!ubicacion && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.textoSec} />
            <Text style={styles.infoText}>{ubicacion}</Text>
          </View>
        )}

        {item.estado_aprobacion === 'rechazado' && !!item.observacion_revision && (
          <View style={styles.rejectBox}>
            <Ionicons name="alert-circle-outline" size={18} color="#B91C1C" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rejectTitle}>Observación del administrador</Text>
              <Text style={styles.rejectText}>{item.observacion_revision}</Text>
            </View>
          </View>
        )}

        <View style={styles.detailHint}>
          <Text style={styles.detailHintText}>Ver detalles</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.azul} />
        </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <FlatList
        data={servicios}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshing={cargando && cargado}
        onRefresh={recargar}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.titleWrap}>
              <Ionicons name="storefront" size={20} color={colors.azulOscuro} />
              <Text style={styles.title}>Mis servicios</Text>
            </View>
            <Text style={styles.subtitle}>Tus lugares y el estado de su aprobación.</Text>
            <Button text="＋ Añadir servicio" onPress={irANuevo} />

            {!!error && (
              <View style={styles.errorCard}>
                <Ionicons name="cloud-offline-outline" size={22} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
                <Button text="Volver a intentar" onPress={recargar} secondary />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          cargando && !cargado ? (
            <Loader tipo="bloque" texto="Cargando tus servicios…" />
          ) : !error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="storefront-outline" size={40} color={colors.doradoTexto} />
              </View>
              <Text style={styles.emptyTitle}>Aún no tienes servicios</Text>
              <Text style={styles.centerText}>
                Registra tu primer lugar y, cuando un administrador lo apruebe, los viajeros podrán
                encontrarlo en el mapa.
              </Text>
              <Button text="Registrar mi primer servicio" onPress={irANuevo} />
            </View>
          ) : null
        }
        renderItem={({ item }) => renderTarjeta(item)}
      />

      <ServicioDetalleModal
        visible={!!seleccionado}
        servicio={seleccionado}
        categoria={seleccionado ? categoriasPorId[seleccionado.categoria_id] : undefined}
        municipio={seleccionado ? municipiosPorId[seleccionado.municipio_id] : undefined}
        onClose={() => setSeleccionado(null)}
      />
    </View>
  );
}