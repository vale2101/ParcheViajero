import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(255, 251, 241, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    padding: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: '100%',
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(233, 184, 91, 0.9)',
    overflow: 'hidden',
  },
  toggleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 251, 241, 0.55)',
  },
  toggleOptionActive: {
    backgroundColor: 'rgba(12, 40, 88, 0.96)',
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
    color: '#5c5c5c',
    textAlign: 'center',
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 251, 241, 0.7)',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#dc2626',
  },
  link: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#064BC2',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(255, 251, 241, 0.85)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  botonCrear: {
    backgroundColor: 'rgba(12, 40, 88, 0.96)',
    borderWidth: 1.5,
    borderColor: 'rgba(233, 184, 91, 0.9)',
    shadowOpacity: 0,
    elevation: 0,
  },
});
