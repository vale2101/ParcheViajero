import { StyleSheet } from 'react-native';
import { colors, radius, sombra, spacing } from './theme';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    gap: 10,
    zIndex: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...sombra,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: colors.texto },
  chipsScroll: { flexGrow: 0 },
  chipsRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: 'center' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 59, 121, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.crema,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: colors.azul, marginBottom: spacing.md },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borde },
  optionText: { fontSize: 15, color: colors.texto },
  optionTextActive: { color: colors.azul, fontWeight: '700' },
});
