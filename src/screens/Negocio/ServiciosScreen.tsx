import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import ServicioEditModal from '../../components/ServicioEditModal';
import ServicioFormModal from '../../components/ServicioFormModal';
import { useServiciosNegocio } from '../../hooks/useServiciosNegocio';
import type { Servicio } from '../../api/servicio';
import { styles } from '../../styles/NegocioServicios.styles';

export default function ServiciosScreen() {
  const { servicios, recargar } = useServiciosNegocio();
  const [modalVisible, setModalVisible] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Tus lugares publicados</Text>
          <Button text="＋ Añadir servicio" onPress={() => setModalVisible(true)} />
        </View>

        <FlatList
          data={servicios}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.placeholder}>Aún no has publicado ningún servicio</Text>
          }
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => setSeleccionado(item)}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              {!!item.direccion && <Text style={styles.cardSubtitle}>{item.direccion}</Text>}
            </Pressable>
          )}
        />
      </View>

      <ServicioFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={recargar}
      />

      <ServicioEditModal
        visible={!!seleccionado}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
        onUpdated={recargar}
        onDeleted={recargar}
      />
    </View>
  );
}