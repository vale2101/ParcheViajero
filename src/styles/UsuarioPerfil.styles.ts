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
});
