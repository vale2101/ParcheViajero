import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
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
  email: { color: '#a3a3a3', marginBottom: 16 },
  button: { width: '100%', marginTop: 16 },
});
