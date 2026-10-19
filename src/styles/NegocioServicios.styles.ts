import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  list: { padding: 20, gap: 12, paddingBottom: 40 },

  headerBlock: { gap: 12, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#1E3A8A' },
  subtitle: { fontSize: 14, color: '#6b6b6b', marginTop: -6 },

  card: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 16,
    gap: 10,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1E3A8A' },

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { flex: 1, fontSize: 14, color: '#171717' },

  rejectBox: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    backgroundColor: '#FDE8E8',
    padding: 10,
  },
  rejectTitle: { fontSize: 12, fontWeight: '700', color: '#B91C1C' },
  rejectText: { fontSize: 13, color: '#171717', marginTop: 2 },
    detailHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    marginTop: 2,
  },
  detailHintText: { fontSize: 13, fontWeight: '700', color: '#0147B9' },

  centerBox: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  centerText: { fontSize: 14, color: '#6b6b6b', textAlign: 'center' },

  errorCard: {
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: '#FAF4E4',
    padding: 16,
  },
  errorText: { fontSize: 14, color: '#dc2626', textAlign: 'center' },

  emptyBox: { alignItems: 'center', gap: 12, paddingVertical: 24 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F0FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1E3A8A' },
});