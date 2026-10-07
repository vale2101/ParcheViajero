import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#0147B9' },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FAF4E4',
    padding: 14,
    justifyContent: 'center',
  },
  inputIdle: { borderColor: '#E8D9B8' },
  inputError: { borderColor: '#ef4444' },
  valueText: { fontSize: 16, color: '#171717' },
  placeholderText: { fontSize: 16, color: '#a3a3a3' },
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FAF4E4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0147B9',
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9B8',
  },
  optionText: { fontSize: 15, color: '#171717' },
  optionTextActive: { color: '#0147B9', fontWeight: '700' },
});
