import { StyleSheet } from 'react-native';
import { colors as c, sombra } from './theme';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.crema },
  list: { padding: 20, gap: 14, paddingBottom: 40 },

  headerBlock: { gap: 12, marginBottom: 8 },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '800', color: c.azulOscuro },
  subtitle: { fontSize: 14, color: c.textoSec, marginTop: -4 },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.borde,
    backgroundColor: c.superficie,
    padding: 14,
    ...sombra,
  },
  polaroidWrap: { paddingTop: 6 },
  cardBody: { flex: 1, minWidth: 0, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: c.azulOscuro },

  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { flex: 1, fontSize: 14, color: c.texto },

  rejectBox: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: c.rojoBorde,
    backgroundColor: c.rojoSuave,
    padding: 10,
  },
  rejectTitle: { fontSize: 12, fontWeight: '700', color: c.rojo },
  rejectText: { fontSize: 13, color: c.texto, marginTop: 2 },
  detailHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    marginTop: 2,
  },
  detailHintText: { fontSize: 13, fontWeight: '700', color: c.azul },

  centerBox: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  centerText: { fontSize: 14, color: c.textoSec, textAlign: 'center' },

  errorCard: {
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: c.rojoBorde,
    backgroundColor: c.superficie,
    padding: 16,
  },
  errorText: { fontSize: 14, color: c.rojo, textAlign: 'center' },

  emptyBox: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.borde,
    backgroundColor: c.superficie,
    paddingHorizontal: 16,
    ...sombra,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: c.doradoSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: c.azulOscuro },
});
