import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#FDFBF6',
    borderWidth: 1,
    borderColor: '#E8D9B8',
    padding: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  photo: {
    height: 132,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoEmoji: { fontSize: 44 },
  photoHint: { fontSize: 11, color: '#6b6b6b', marginTop: 4 },

  body: { paddingHorizontal: 4, gap: 8 },
  name: { fontSize: 18, fontWeight: '800', color: '#1E3A8A' },

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { flex: 1, fontSize: 13, color: '#171717' },
  priceText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#92400E' },

  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 2 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    minHeight: 46,
    paddingHorizontal: 10,
  },
  btnEdit: { backgroundColor: '#0147B9' },
  btnEditText: { fontSize: 14, fontWeight: '600', color: '#FEBA03' },
  btnDelete: {
    backgroundColor: '#FDFBF6',
    borderWidth: 1.5,
    borderColor: '#f0b4b4',
  },
  btnDeleteText: { fontSize: 14, fontWeight: '600', color: '#B91C1C' },
  btnDisabled: { opacity: 0.5 },
});