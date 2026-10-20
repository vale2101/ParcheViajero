import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import ServicioDetalleModal from '../../components/ServicioDetalleModal';
import { useMisServicios } from '../../hooks/useMisServicios';
import type { Servicio } from '../../api/servicio';
import { getEstadoVisual } from '../../utils/estadoServicio';
import { styles } from '../../styles/NegocioServicios.styles';

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

    return (
      <Pressable
        style={styles.card}
        onPress={() => setSeleccionado(item)}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalles de ${item.nombre}`}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>

        <View
          style={[styles.badge, { backgroundColor: estado.bg, borderColor: estado.borde }]}
          accessibilityLabel={`Estado: ${estado.texto}`}>
          <Ionicons name={estado.icono} size={16} color={estado.fg} />
          <Text style={[styles.badgeText, { color: estado.fg }]}>{estado.texto}</Text>
        </View>

        {!!categoria && (
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={16} color="#6b6b6b" />
            <Text style={styles.infoText}>{categoria}</Text>
          </View>
        )}

        {!!ubicacion && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#6b6b6b" />
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
          <Ionicons name="chevron-forward" size={16} color="#0147B9" />
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
            <Text style={styles.title}>Mis servicios</Text>
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
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#0147B9" />
              <Text style={styles.centerText}>Cargando tus servicios…</Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="storefront-outline" size={40} color="#0147B9" />
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