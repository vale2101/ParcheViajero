import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0147B9',
  },

  input: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 14,
    fontSize: 15,
    color: '#171717',
  },

  resultsList: {
    maxHeight: 240,
  },

  placeholder: {
    color: '#a3a3a3',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 12,
  },

  resultCard: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 12,
    marginBottom: 8,
  },

  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0147B9',
  },

  resultSubtitle: {
    fontSize: 12,
    color: '#a3a3a3',
    marginTop: 2,
  },
});
