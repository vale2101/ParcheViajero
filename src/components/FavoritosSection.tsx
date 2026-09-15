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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 20,
    alignItems: 'center',
  },
  placeholder: { color: '#a3a3a3', fontSize: 14 },
});