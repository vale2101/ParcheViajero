import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '85%',
    borderRadius: 24,
    backgroundColor: '#FDFBF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9B8',
  },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: '#1E3A8A' },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  content: { padding: 20, gap: 14 },

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

  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  rowIcon: { marginTop: 2 },
  rowLabel: { fontSize: 12, color: '#6b6b6b' },
  rowValue: { fontSize: 15, color: '#171717' },

  rejectBox: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ef4444',
    backgroundColor: '#FDE8E8',
    padding: 12,
  },
  rejectTitle: { fontSize: 12, fontWeight: '700', color: '#B91C1C' },
  rejectText: { fontSize: 13, color: '#171717', marginTop: 2 },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8D9B8',
  },
});