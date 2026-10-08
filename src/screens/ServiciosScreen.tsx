import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import ServicioCard from '../components/ServicioCard';
import ServicioEditModal from '../components/ServicioEditModal';
import ServicioFormModal from '../components/ServicioFormModal';
import { useServiciosNegocio } from '../hooks/useServiciosNegocio';
import type { Servicio } from '../api/servicio';

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
            <ServicioCard servicio={item} onPress={() => setSeleccionado(item)} />
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { flex: 1, padding: 20, gap: 16 },
  headerRow: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  list: { gap: 12 },
  placeholder: { color: '#a3a3a3', fontSize: 15, textAlign: 'center', marginTop: 40 },
});
