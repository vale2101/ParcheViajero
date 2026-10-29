import { StyleSheet } from 'react-native';
import { colors as c, sombra } from './theme';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.crema },
  wrap: { width: '100%', maxWidth: 900, alignSelf: 'center' },
  content: { padding: 16, gap: 14, paddingBottom: 32, width: '100%', maxWidth: 900, alignSelf: 'center' },
  headerBox: { paddingHorizontal: 16, paddingTop: 14, gap: 10 },
  title: { fontSize: 26, fontWeight: '800', color: c.azulOscuro },
  subtitle: { fontSize: 14, color: c.textoSec, marginTop: -6 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: c.azulOscuro },

  /* Encabezado con logo */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
    backgroundColor: c.crema,
    borderBottomWidth: 1,
    borderBottomColor: c.borde,
  },
  headerLogo: { height: 48, aspectRatio: 1.8 },

  /* Tarjeta de administrador */
  adminBar: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, backgroundColor: c.superficie, borderWidth: 1, borderColor: c.borde, padding: 12, ...sombra },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: c.azul, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  adminName: { fontSize: 17, fontWeight: '800', color: c.azulOscuro },
  roleBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, backgroundColor: c.doradoSuave, borderWidth: 1.5, borderColor: c.dorado, paddingHorizontal: 8, paddingVertical: 3, marginTop: 2 },
  roleText: { fontSize: 11, fontWeight: '700', color: c.doradoTexto },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  /* Bienvenida */
  greetingCard: { borderRadius: 18, backgroundColor: c.superficie, borderWidth: 1, borderColor: c.borde, padding: 16, overflow: 'hidden', minHeight: 110, justifyContent: 'center', ...sombra },
  greetingTitle: { fontSize: 22, fontWeight: '800', color: c.azul },
  greetingText: { fontSize: 13, color: c.textoSec, marginTop: 4, maxWidth: '62%' },
  deco: { position: 'absolute', right: 0, bottom: 0, width: 150, height: 100 },

  /* Indicadores */
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flexBasis: '45%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, backgroundColor: c.superficie, borderWidth: 1, borderColor: c.borde, padding: 14, ...sombra },
  statIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 26, fontWeight: '800', color: c.azulOscuro },
  statLabel: { fontSize: 12, color: c.textoSec },

  /* Accesos rápidos */
  accessCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, backgroundColor: c.superficie, borderWidth: 1, borderColor: c.borde, padding: 14, minHeight: 64, ...sombra },
  accessIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: c.azulSuave, alignItems: 'center', justifyContent: 'center' },
  accessTitle: { fontSize: 15, fontWeight: '800', color: c.azulOscuro },
  accessDesc: { fontSize: 12, color: c.textoSec },
  accessBadge: { minWidth: 24, height: 24, borderRadius: 12, backgroundColor: c.rojo, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  accessBadgeText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  /* Buscador, tabs y filtros */
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, borderWidth: 1.5, borderColor: c.borde, backgroundColor: c.superficie, paddingLeft: 12, minHeight: 48, overflow: 'hidden' },
  searchInput: { flex: 1, fontSize: 15, color: c.texto, paddingVertical: 10 },
  searchFilterBtn: { width: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: c.borde },
  searchFilterBtnActive: { backgroundColor: c.azulSuave },
  segmented: { flexDirection: 'row', gap: 8 },
  segOption: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 4, borderRadius: 12, borderWidth: 1.5, borderColor: c.borde, backgroundColor: c.superficie },
  segActive: { backgroundColor: c.azul, borderColor: c.azul },
  segText: { fontSize: 13, fontWeight: '700', color: c.azulOscuro },
  segTextActive: { color: '#fff' },
  filterToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 40 },
  filterToggleText: { fontSize: 14, fontWeight: '700', color: c.azul },
  filterPanel: { gap: 8, borderRadius: 14, backgroundColor: c.beige, borderWidth: 1, borderColor: c.borde, padding: 12, marginBottom: 4 },
  filterLabel: { fontSize: 12, fontWeight: '700', color: c.textoSec },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, borderWidth: 1.5, borderColor: c.borde, backgroundColor: c.superficie, paddingHorizontal: 12, paddingVertical: 7 },
  chipActive: { backgroundColor: c.azul, borderColor: c.azul },
  chipText: { fontSize: 13, fontWeight: '600', color: c.azulOscuro },
  chipTextActive: { color: '#fff' },

  /* Tarjetas de lista */
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, backgroundColor: c.superficie, borderWidth: 1, borderColor: c.borde, padding: 10, ...sombra },
  cardPhoto: { width: 84, height: 84, borderRadius: 14, overflow: 'hidden' },
  cardBody: { flex: 1, gap: 4 },
  cardName: { fontSize: 16, fontWeight: '800', color: c.azulOscuro },
  lineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lineText: { flex: 1, fontSize: 12, color: c.texto },
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, borderWidth: 1.5, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  userAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: c.azul, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  /* Estados */
  centerBox: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  centerText: { fontSize: 14, color: c.textoSec, textAlign: 'center' },
  emptyBox: { alignItems: 'center', gap: 10, paddingVertical: 32, paddingHorizontal: 16 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: c.azulSuave, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: c.azulOscuro, textAlign: 'center' },
  errorCard: { alignItems: 'center', gap: 10, borderRadius: 16, borderWidth: 2, borderColor: c.rojoBorde, backgroundColor: c.superficie, padding: 14 },
  errorText: { fontSize: 14, color: c.rojo, textAlign: 'center' },
  okBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 2, borderColor: '#059669', backgroundColor: c.verdeSuave, padding: 12 },
  okText: { flex: 1, fontSize: 14, fontWeight: '600', color: c.verde },

  /* Detalle */
  subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 6, backgroundColor: c.crema, borderBottomWidth: 1, borderBottomColor: c.borde },
  subHeaderTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: c.azulOscuro },
  subHeaderLogo: { flex: 1, height: 44 },
  subHeaderSpacer: { width: 44 },
  detailPhoto: { height: 220, borderRadius: 18 },
  gallery: { gap: 10 },
  galleryMain: { height: 230, borderRadius: 18, overflow: 'hidden', backgroundColor: c.beige, borderWidth: 1, borderColor: c.borde },
  galleryCounter: { position: 'absolute', right: 10, top: 10, borderRadius: 12, backgroundColor: 'rgba(18,59,121,0.85)', paddingHorizontal: 10, paddingVertical: 4 },
  galleryCounterText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  galleryNav: { position: 'absolute', top: '50%', marginTop: -20, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,251,241,0.9)' },
  galleryThumbs: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  galleryThumb: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  galleryThumbActive: { borderColor: c.dorado },
  bigName: { fontSize: 24, fontWeight: '800', color: c.azulOscuro },
  sectionCard: { borderRadius: 18, borderWidth: 1, borderColor: c.borde, backgroundColor: c.superficie, padding: 14, gap: 12, ...sombra },
  infoRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: c.textoSec },
  infoValue: { fontSize: 15, color: c.texto },
  rejectBox: { flexDirection: 'row', gap: 8, borderRadius: 12, borderWidth: 1.5, borderColor: c.rojoBorde, backgroundColor: c.rojoSuave, padding: 12 },
  rejectTitle: { fontSize: 12, fontWeight: '700', color: c.rojo },
  rejectText: { fontSize: 13, color: c.texto, marginTop: 2 },
  histItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  histTitle: { fontSize: 14, fontWeight: '700', color: c.texto },
  histMeta: { fontSize: 12, color: c.textoSec },
  histObs: { fontSize: 13, color: c.texto, marginTop: 4 },

  /* Revisión */
  obsInput: { borderRadius: 12, borderWidth: 1.5, borderColor: c.borde, backgroundColor: c.superficie, padding: 12, fontSize: 15, color: c.texto, minHeight: 96, textAlignVertical: 'top' },
  obsInputFocus: { borderColor: c.dorado },
  obsInputError: { borderColor: c.rojoBorde },
  obsCounter: { alignSelf: 'flex-end', fontSize: 12, color: c.textoSec },
  fieldError: { fontSize: 12, fontWeight: '500', color: c.rojo },
  actionsRow: { flexDirection: 'row', gap: 10 },
  btnAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14, minHeight: 52, paddingHorizontal: 10 },
  btnApprove: { backgroundColor: c.azul },
  btnApproveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnReject: { backgroundColor: c.rojoSuave, borderWidth: 2, borderColor: c.rojoBorde },
  btnRejectText: { fontSize: 15, fontWeight: '700', color: c.rojo },
  btnDisabled: { opacity: 0.5 },

  /* Perfil */
  profileBox: { alignItems: 'center', gap: 8, paddingVertical: 24 },

  /* Reseñas */
  reviewCard: { borderRadius: 18, backgroundColor: c.superficie, borderWidth: 1, borderColor: c.borde, padding: 14, gap: 8, ...sombra },
  reviewHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  reviewComment: { fontSize: 14, color: c.texto },
  reviewEmpty: { fontSize: 13, color: c.textoSec, fontStyle: 'italic' },
  btnDeleteSmall: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, borderWidth: 1.5, borderColor: '#f0b4b4', backgroundColor: c.superficie, minHeight: 44, paddingHorizontal: 14 },
  btnDeleteSmallText: { fontSize: 14, fontWeight: '600', color: c.rojo },
});
