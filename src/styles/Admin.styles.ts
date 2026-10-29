import { StyleSheet } from 'react-native';

const AZUL = '#0147B9';
const AZUL_OSC = '#1E3A8A';
const ORO = '#FEBA03';
const CREMA = '#FDFBF6';
const SUP = '#FAF4E4';
const BORDE = '#E8D9B8';
const TEXTO = '#171717';
const SEC = '#6b6b6b';
const ROJO = '#dc2626';

const sombra = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
} as const;

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREMA },
  wrap: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  content: { padding: 16, gap: 14, paddingBottom: 32, width: '100%', maxWidth: 900, alignSelf: 'center' },
  headerBox: { paddingHorizontal: 16, paddingTop: 14, gap: 10 },
  title: { fontSize: 24, fontWeight: '700', color: AZUL_OSC },
  subtitle: { fontSize: 14, color: SEC, marginTop: -6 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: AZUL_OSC },

  /* Encabezado del admin */
  adminBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: AZUL_OSC, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#F5B700' },
  adminName: { fontSize: 17, fontWeight: '700', color: AZUL_OSC },
  roleBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, backgroundColor: '#FFF4D6', borderWidth: 1.5, borderColor: ORO, paddingHorizontal: 8, paddingVertical: 3, marginTop: 2 },
  roleText: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  /* Indicadores */
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flexBasis: '45%', flexGrow: 1, borderRadius: 18, backgroundColor: SUP, borderWidth: 1, borderColor: BORDE, padding: 14, gap: 6, ...sombra },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 28, fontWeight: '800', color: AZUL_OSC },
  statLabel: { fontSize: 13, color: SEC },

  /* Accesos rápidos */
  accessCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: CREMA, borderWidth: 1, borderColor: BORDE, padding: 14, minHeight: 64, ...sombra },
  accessIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F0FD', alignItems: 'center', justifyContent: 'center' },
  accessTitle: { fontSize: 15, fontWeight: '700', color: AZUL_OSC },
  accessDesc: { fontSize: 12, color: SEC },

  /* Buscador, tabs y filtros */
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, borderWidth: 2, borderColor: BORDE, backgroundColor: SUP, paddingHorizontal: 12, minHeight: 48 },
  searchInput: { flex: 1, fontSize: 15, color: TEXTO, paddingVertical: 10 },
  segmented: { flexDirection: 'row', borderRadius: 14, borderWidth: 2, borderColor: BORDE, overflow: 'hidden', backgroundColor: SUP },
  segOption: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 2 },
  segActive: { backgroundColor: AZUL },
  segText: { fontSize: 12, fontWeight: '700', color: AZUL },
  segTextActive: { color: ORO },
  filterToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 40 },
  filterToggleText: { fontSize: 14, fontWeight: '700', color: AZUL },
  filterPanel: { gap: 8, borderRadius: 14, backgroundColor: SUP, borderWidth: 1, borderColor: BORDE, padding: 12, marginBottom: 4 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: SEC },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, borderWidth: 1.5, borderColor: BORDE, backgroundColor: CREMA, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { backgroundColor: AZUL, borderColor: AZUL },
  chipText: { fontSize: 13, fontWeight: '600', color: AZUL },
  chipTextActive: { color: ORO },

  /* Tarjetas de lista */
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, backgroundColor: CREMA, borderWidth: 1, borderColor: BORDE, padding: 10, ...sombra },
  cardPhoto: { width: 84, height: 84 },
  cardBody: { flex: 1, gap: 4 },
  cardName: { fontSize: 16, fontWeight: '800', color: AZUL_OSC },
  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lineText: { flex: 1, fontSize: 12, color: TEXTO },
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  userAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: AZUL_OSC, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  /* Estados */
  centerBox: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  centerText: { fontSize: 14, color: SEC, textAlign: 'center' },
  emptyBox: { alignItems: 'center', gap: 10, paddingVertical: 32, paddingHorizontal: 16 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F0FD', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: AZUL_OSC, textAlign: 'center' },
  errorCard: { alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 2, borderColor: '#ef4444', backgroundColor: SUP, padding: 14 },
  errorText: { fontSize: 14, color: ROJO, textAlign: 'center' },
  okBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 2, borderColor: '#059669', backgroundColor: '#E3F4EC', padding: 12 },
  okText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#047857' },

  /* Detalle */
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: BORDE },
  subHeaderTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: AZUL_OSC },
  detailPhoto: { height: 170 },
  bigName: { fontSize: 22, fontWeight: '800', color: AZUL_OSC },
  sectionCard: { borderRadius: 18, borderWidth: 1, borderColor: BORDE, backgroundColor: SUP, padding: 14, gap: 12 },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: SEC },
  infoValue: { fontSize: 15, color: TEXTO },
  rejectBox: { flexDirection: 'row', gap: 8, borderRadius: 12, borderWidth: 1.5, borderColor: '#ef4444', backgroundColor: '#FDE8E8', padding: 12 },
  rejectTitle: { fontSize: 12, fontWeight: '700', color: '#B91C1C' },
  rejectText: { fontSize: 13, color: TEXTO, marginTop: 2 },
  histItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  histTitle: { fontSize: 14, fontWeight: '700', color: TEXTO },
  histMeta: { fontSize: 12, color: SEC },
  histObs: { fontSize: 13, color: TEXTO, marginTop: 4 },

  /* Revisión */
  obsInput: { borderRadius: 12, borderWidth: 2, borderColor: BORDE, backgroundColor: CREMA, padding: 12, fontSize: 15, color: TEXTO, minHeight: 96, textAlignVertical: 'top' },
  obsInputError: { borderColor: '#ef4444' },
  fieldError: { fontSize: 12, fontWeight: '500', color: ROJO },
  actionsRow: { flexDirection: 'row', gap: 10 },
  btnAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 16, minHeight: 52, paddingHorizontal: 10 },
  btnApprove: { backgroundColor: '#047857' },
  btnApproveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnReject: { backgroundColor: '#FDE8E8', borderWidth: 2, borderColor: '#ef4444' },
  btnRejectText: { fontSize: 15, fontWeight: '700', color: '#B91C1C' },
  btnDisabled: { opacity: 0.5 },

  /* Perfil */
  profileBox: { alignItems: 'center', gap: 8, paddingVertical: 24 },
    /* Reseñas */
  reviewCard: { borderRadius: 18, backgroundColor: CREMA, borderWidth: 1, borderColor: BORDE, padding: 14, gap: 8, ...sombra },
  reviewHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  reviewComment: { fontSize: 14, color: TEXTO },
  reviewEmpty: { fontSize: 13, color: SEC, fontStyle: 'italic' },
  btnDeleteSmall: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, borderWidth: 1.5, borderColor: '#f0b4b4', backgroundColor: CREMA, minHeight: 44, paddingHorizontal: 14 },
  btnDeleteSmallText: { fontSize: 14, fontWeight: '600', color: '#B91C1C' },
});