import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 14,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0147B9' },
  cardSubtitle: { fontSize: 12, color: '#a3a3a3', marginTop: 2 },
});
