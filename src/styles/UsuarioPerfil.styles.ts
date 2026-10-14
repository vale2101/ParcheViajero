import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { padding: 24, gap: 28 },
  profileHeader: { alignItems: 'center', gap: 8 },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: '#1E3A8A',
    marginBottom: 8,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#F5B700' },
  name: { fontSize: 18, fontWeight: '600', color: '#1E3A8A' },
  email: { color: '#a3a3a3', marginBottom: 8 },
  button: { width: '100%', marginTop: 8 },

  // Ventanita de información (Acerca de / Términos)
  infoBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  infoCard: {
    backgroundColor: '#FDFBF6',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    padding: 24,
    gap: 12,
  },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#0147B9' },
  infoText: { fontSize: 14, color: '#171717', lineHeight: 21 },
});
