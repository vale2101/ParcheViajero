import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#0147B9' },
  mapWrapper: {
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: { width: '100%', height: '100%' },
  loadingText: { position: 'absolute', color: '#a3a3a3', fontSize: 13 },
  hint: { fontSize: 12, color: '#a3a3a3' },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 12,
    fontSize: 14,
    color: '#171717',
  },
});
