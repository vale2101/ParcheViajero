import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contenedor: { marginBottom: 8 },
  avatar: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: '#1E3A8A',
    overflow: 'hidden',
  },
  imagen: { width: '100%', height: '100%' },
  inicial: { fontSize: 32, fontWeight: '700', color: '#F5B700' },
  camara: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3A8A',
    borderWidth: 2,
    borderColor: '#FDFBF6',
  },
});
