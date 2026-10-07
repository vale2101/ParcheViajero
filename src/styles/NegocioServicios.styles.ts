import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { flex: 1, padding: 20, gap: 16 },
  headerRow: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  list: { gap: 12 },
  placeholder: { color: '#a3a3a3', fontSize: 15, textAlign: 'center', marginTop: 40 },
  card: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1E3A8A' },
  cardSubtitle: { fontSize: 13, color: '#a3a3a3', marginTop: 4 },
});
