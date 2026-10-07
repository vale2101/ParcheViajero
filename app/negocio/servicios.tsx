import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Button from '../../src/components/Button';
import ScreenHeader from '../../src/components/ScreenHeader';
import ServicioEditModal from '../../src/components/ServicioEditModal';
import ServicioFormModal from '../../src/components/ServicioFormModal';
import { useAuth } from '../../src/context/AuthContext';
import { getServicios, type Servicio } from '../../src/api/servicio';
import { styles } from '../../src/styles/NegocioServicios.styles';

export default function Servicios() {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  const cargarServicios = useCallback(async () => {
    try {
      const { data } = await getServicios();
      setServicios(data.filter((s) => s.usuario_id === user?._id));
    } catch {
      // se puede mostrar un toast/error aquí si se quiere
    }
  }, [user?._id]);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

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
        onCreated={cargarServicios}
      />

      <ServicioEditModal
        visible={!!seleccionado}
        servicio={seleccionado}
        onClose={() => setSeleccionado(null)}
        onUpdated={cargarServicios}
        onDeleted={cargarServicios}
      />
    </View>
  );
}
