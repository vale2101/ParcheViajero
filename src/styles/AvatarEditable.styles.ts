import { StyleSheet } from 'react-native';
import { colors as c } from './theme';

export const styles = StyleSheet.create({
  contenedor: { marginBottom: 4 },
  anillo: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3,
    borderColor: c.dorado,
    padding: 5,
    backgroundColor: c.crema,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 56,
    backgroundColor: c.azulOscuro,
    overflow: 'hidden',
  },
  imagen: { width: '100%', height: '100%' },
  inicial: { fontSize: 44, fontWeight: '800', color: c.dorado },
  camara: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.azulOscuro,
    borderWidth: 2,
    borderColor: c.crema,
  },
});
