import { StyleSheet } from 'react-native';
import { colors as c, sombra } from './theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.crema,
  },

  mapWrapper: {
    flex: 1,
    position: 'relative',
  },

  loadingBadge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
  },

  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: c.azul,
  },

  errorBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: c.superficie,
    borderWidth: 1,
    borderColor: c.rojoBorde,
    borderRadius: 16,
    padding: 12,
    ...sombra,
  },

  errorText: {
    flex: 1,
    fontSize: 13,
    color: c.rojo,
  },

  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: c.azul,
  },

  warningBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    backgroundColor: c.doradoSuave,
    borderWidth: 1,
    borderColor: c.dorado,
    borderRadius: 16,
    padding: 10,
    ...sombra,
  },

  warningText: {
    fontSize: 12,
    color: c.texto,
    textAlign: 'center',
  },

  emptyCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '30%',
    gap: 12,
    backgroundColor: c.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.borde,
    padding: 24,
    ...sombra,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: c.azulOscuro,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: c.textoSec,
    textAlign: 'center',
  },

  infoCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    gap: 4,
    backgroundColor: c.superficie,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.borde,
    padding: 16,
    ...sombra,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: c.azulOscuro,
  },

  infoText: {
    fontSize: 13,
    color: c.textoSec,
  },
});

export default styles;
