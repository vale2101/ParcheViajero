import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  lista: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  saludoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.azulSuave,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 48, height: 48 },
  avatarLetra: { fontSize: 18, fontWeight: '800', color: colors.azulOscuro },
  chipsFila: { gap: spacing.sm, paddingRight: spacing.lg },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borde,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buscadorInput: { flex: 1, fontSize: 14, color: colors.texto },
  errorCaja: { gap: spacing.md },
  errorTexto: { color: colors.rojo, fontSize: 14 },
  fade: { flex: 1 },
});
