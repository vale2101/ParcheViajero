import { FlatList, StyleSheet, Text, View } from 'react-native';
import FiltroChips from '../../components/FiltroChips';
import ResenaCard from '../../components/ResenaCard';
import ResumenResenas from '../../components/ResumenResenas';
import ScreenHeader from '../../components/ScreenHeader';
import { useResenasNegocio } from '../../hooks/useResenasNegocio';

export default function ResenasNegocioScreen() {
  const r = useResenasNegocio();

  if (r.servicios.length === 0) {
    return (
      <View style={styles.screen}>
        <ScreenHeader />
        <Text style={styles.placeholder}>Aún no has publicado ningún servicio</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <FlatList
        data={r.visibles}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerList}>
            <Text style={styles.sectionTitle}>Lo que dicen de tus lugares</Text>

            <FiltroChips
              value={r.servicioId}
              onChange={r.setServicioId}
              opciones={r.servicios.map((s) => ({ value: s._id, label: s.nombre }))}
            />

            <ResumenResenas resenas={r.resenas} />

            {r.bajasCount > 0 && (
              <Text style={styles.alerta}>
                Tienes {r.bajasCount} {r.bajasCount === 1 ? 'reseña' : 'reseñas'} de 3★ o menos.
                Léelas para saber qué mejorar.
              </Text>
            )}

            <FiltroChips
              value={r.filtro}
              onChange={r.setFiltro}
              opciones={[
                { value: 'todas', label: 'Todas' },
                { value: 'recientes', label: 'Más recientes' },
                { value: 'bajas', label: 'Bajas' },
              ]}
            />
          </View>
        }
        ListEmptyComponent={
          !r.loading ? (
            <Text style={styles.placeholder}>No hay reseñas para mostrar</Text>
          ) : null
        }
        renderItem={({ item }) => <ResenaCard resena={item} nombre={r.nombres[item.usuario_id]} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { padding: 20, gap: 12 },
  headerList: { gap: 14, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  alerta: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F5B700',
    padding: 12,
    fontSize: 13,
    color: '#1E3A8A',
  },
  placeholder: { color: '#737373', fontSize: 14, textAlign: 'center', marginTop: 40 },
});
