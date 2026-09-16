import { StyleSheet, Text, View } from 'react-native';

export default function FavoritosSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mis favoritos</Text>
      <View style={styles.emptyBox}>
        <Text style={styles.placeholder}>Aún no tienes favoritos guardados</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0147B9' },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 20,
    alignItems: 'center',
  },
  placeholder: { color: '#a3a3a3', fontSize: 14 },
});