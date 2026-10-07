import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#e5e5e5',
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 384,
    gap: 20,
    borderRadius: 24,
    backgroundColor: '#FDFBF6',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },
  toggleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FDFBF6',
  },
  toggleOptionActive: {
    backgroundColor: '#1E3A8A',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  toggleTextActive: {
    color: '#F5B700',
  },
  intro: {
    color: '#a3a3a3',
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FDFBF6',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#dc2626',
  },
  link: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#1E3A8A',
  },
});
