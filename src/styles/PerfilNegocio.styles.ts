import { StyleSheet } from 'react-native';

const AZUL = '#0147B9';
const AZUL_OSC = '#1E3A8A';
const ORO = '#FEBA03';
const CREMA = '#FDFBF6';
const SUPERFICIE = '#FAF4E4';
const BORDE = '#E8D9B8';
const TEXTO = '#171717';
const SECUNDARIO = '#6b6b6b';
const ROJO = '#dc2626';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREMA },
  content: { padding: 24, gap: 20, paddingBottom: 40 },

  profileHeader: { alignItems: 'center', gap: 6 },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: AZUL_OSC,
    marginBottom: 6,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#F5B700' },
  name: { fontSize: 18, fontWeight: '600', color: AZUL_OSC },
  email: { color: '#a3a3a3' },
  phone: { color: SECUNDARIO, fontSize: 13 },

  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#059669',
    backgroundColor: '#E3F4EC',
    padding: 12,
  },
  avisoText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#047857' },

  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' },
  loadingText: { fontSize: 14, color: SECUNDARIO },

  emptyBox: {
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDE,
    backgroundColor: SUPERFICIE,
    padding: 20,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: AZUL_OSC, textAlign: 'center' },

  errorCard: {
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: SUPERFICIE,
    padding: 16,
  },
  errorText: { fontSize: 14, color: ROJO, textAlign: 'center' },

  /* Selector */
  selectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDE,
    backgroundColor: SUPERFICIE,
    padding: 14,
    minHeight: 52,
  },
  selectorBarOpen: { borderColor: ORO },
  selectorText: { flex: 1, fontSize: 16, color: TEXTO },
  selectorPlaceholder: { flex: 1, fontSize: 16, color: '#a3a3a3' },
  selectorList: {
    marginTop: 6,
    maxHeight: 260,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDE,
    backgroundColor: CREMA,
    overflow: 'hidden',
  },
  option: { padding: 14, borderBottomWidth: 1, borderBottomColor: BORDE },
  optionActive: { backgroundColor: '#E8F0FD' },
  optionName: { fontSize: 15, color: TEXTO },
  optionNameActive: { color: AZUL, fontWeight: '700' },
  optionSub: { fontSize: 12, color: SECUNDARIO, marginTop: 2 },

  /* Panel */
  panel: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDE,
    backgroundColor: SUPERFICIE,
    padding: 16,
    gap: 14,
  },
  panelTitle: { fontSize: 19, fontWeight: '700', color: AZUL_OSC },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: SECUNDARIO },
  infoValue: { fontSize: 15, color: TEXTO },
  techBox: { borderRadius: 10, backgroundColor: CREMA, padding: 10, gap: 2 },
  techText: { fontSize: 12, color: SECUNDARIO },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    padding: 14,
    minHeight: 50,
  },
  actionEdit: { backgroundColor: AZUL },
  actionEditText: { fontSize: 15, fontWeight: '600', color: ORO },
  actionDelete: { backgroundColor: '#FDE8E8', borderWidth: 2, borderColor: '#ef4444' },
  actionDeleteText: { fontSize: 15, fontWeight: '600', color: '#B91C1C' },

  /* Botones inferiores */
  buttonsRow: { flexDirection: 'row', gap: 10 },
  profileBtn: { flex: 1, flexDirection: 'row', gap: 8, justifyContent: 'center' },
  profileBtnText: { fontSize: 16, fontWeight: '600', color: ORO },

  /* Modal flotante centrado (perfil y confirmación) */
  backdropCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardCenter: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    borderRadius: 24,
    backgroundColor: CREMA,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDE,
  },
  cardTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: AZUL_OSC },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  cardForm: { padding: 20, gap: 16 },
  cardFooter: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: BORDE },
  footerBtn: { flex: 1 },
  errorBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: SUPERFICIE,
    padding: 12,
  },
  errorBoxText: { fontSize: 14, color: ROJO, textAlign: 'center' },

  confirmBody: { padding: 20, gap: 12 },
  confirmText: { fontSize: 15, color: TEXTO },
  confirmDanger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#dc2626',
  },
  confirmDangerText: { fontSize: 16, fontWeight: '600', color: '#fff' },

  /* Modal de edición de servicio (hoja inferior) */
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: SUPERFICIE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '94%',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: AZUL },
  currentLoc: {
    gap: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDE,
    backgroundColor: CREMA,
    padding: 12,
  },
  currentLocText: { fontSize: 14, color: TEXTO },
  fieldHelp: { fontSize: 12, color: SECUNDARIO },
  fieldError: { fontSize: 12, fontWeight: '500', color: ROJO },
});