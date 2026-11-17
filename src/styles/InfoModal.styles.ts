import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FDFBF6',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0147B9' },
  text: { fontSize: 14, color: '#171717', lineHeight: 21 },
});
