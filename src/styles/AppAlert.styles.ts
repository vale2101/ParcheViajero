import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FDFBF6',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#171717',
    lineHeight: 21,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
  },
  confirmBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 16,
    minHeight: 52,
  },
  confirmPeligro: {
    backgroundColor: '#dc2626',
  },
  confirmExito: {
    backgroundColor: '#047857',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
