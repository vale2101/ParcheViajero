import { StyleSheet } from 'react-native';
import { colors as c, sombra } from './theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.borde,
    backgroundColor: c.superficie,
    padding: 12,
    gap: 6,
    overflow: 'hidden',
    ...sombra,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  autor: { flex: 1, fontSize: 14, fontWeight: '700', color: c.azulOscuro },
  fecha: { fontSize: 12, color: c.textoSec },
  comentario: { fontSize: 14, color: c.texto, lineHeight: 20 },
  verMas: { fontSize: 13, fontWeight: '700', color: c.azul, marginTop: 2 },
});
