import { StyleSheet } from 'react-native';
import { colors, radius, sombra, spacing } from './theme';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  primary: {
    backgroundColor: colors.azulOscuro,
    ...sombra,
  },
  secondary: {
    backgroundColor: colors.superficie,
    borderWidth: 2,
    borderColor: colors.dorado,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.azul,
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
    color: colors.dorado,
  },
  textSecondary: {
    color: colors.azulOscuro,
  },
  textOutline: {
    color: colors.azul,
  },
});
