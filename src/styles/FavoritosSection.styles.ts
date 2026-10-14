
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 10 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0147B9' },
  count: { fontSize: 12, color: '#a3a3a3' },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
  },
  placeholder: { color: '#a3a3a3', fontSize: 14 },
  box: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: '#E8D9B8' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
  info: { flex: 1 },
  nombre: { fontSize: 14, fontWeight: '600', color: '#171717' },
  municipio: { fontSize: 12, color: '#a3a3a3', marginTop: 2 },
  verMasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8D9B8',
  },
  verMasText: { fontSize: 13, fontWeight: '600', color: '#0147B9' },
});

