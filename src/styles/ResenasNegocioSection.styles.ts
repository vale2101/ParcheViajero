import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { gap: 12, backgroundColor: '#ffffff'},
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0147B9' },
  resumen: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  promedio: { fontSize: 28, fontWeight: '800', color: '#1E3A8A' },
  totalText: { fontSize: 13, color: '#a3a3a3' },
  placeholder: { color: '#a3a3a3', fontSize: 14, textAlign: 'center', marginVertical: 12 },
  card: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFoto: { width: 40, height: 40, borderRadius: 20 },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#F5B700' },
  nombre: { fontSize: 15, fontWeight: '700', color: '#1E3A8A' },
  fecha: { fontSize: 12, color: '#a3a3a3' },
  comentario: { fontSize: 14, color: '#171717', lineHeight: 20 },
});
