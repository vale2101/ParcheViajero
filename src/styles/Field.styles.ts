import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0147B9', 
  },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#FAF4E4', 
    padding: 14,
    fontSize: 16,
    color: '#171717',
  },
  inputIdle: {
    borderColor: '#E8D9B8',
  },
  inputFocused: {
    borderColor: '#FEBA03', 
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#dc2626',
  },
});
