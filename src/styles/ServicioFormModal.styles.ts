import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FAF4E4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9B8',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0147B9' },
  closeText: { fontSize: 18, color: '#a3a3a3' },
  form: { padding: 24, gap: 16 },
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FAF4E4',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#dc2626',
  },
});
