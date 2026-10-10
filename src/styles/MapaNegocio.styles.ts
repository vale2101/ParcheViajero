import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FDFBF6',
  },

  mapWrapper: {
    flex: 1,
    position: 'relative',
  },

  loadingBadge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDFBF6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0147B9',
  },

  errorBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#FDFBF6',
    borderWidth: 2,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 12,
  },

  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#dc2626',
  },

  retryText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0147B9',
  },

  warningBanner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    backgroundColor: '#FAF4E4',
    borderWidth: 2,
    borderColor: '#FEBA03',
    borderRadius: 12,
    padding: 10,
  },

  warningText: {
    fontSize: 12,
    color: '#171717',
    textAlign: 'center',
  },

  emptyCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '30%',
    gap: 12,
    backgroundColor: '#FDFBF6',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0147B9',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#a3a3a3',
    textAlign: 'center',
  },

  infoCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    gap: 4,
    backgroundColor: '#FDFBF6',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0147B9',
  },

  infoText: {
    fontSize: 13,
    color: '#6b6b6b',
  },
});

export default styles;