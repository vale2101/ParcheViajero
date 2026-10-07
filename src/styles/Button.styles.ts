import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
  },
  primary: {
    backgroundColor: '#0147B9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  secondary: {
    backgroundColor: '#FAF4E4',
    borderWidth: 2,
    borderColor: '#FEBA03',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#FEBA03',
  },
  textSecondary: {
    color: '#0147B9',
  },
});
