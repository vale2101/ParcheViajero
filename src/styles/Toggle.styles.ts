import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FAF4E4',
  },
  optionActive: {
    backgroundColor: '#0147B9',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0147B9',
  },
  textActive: {
    color: '#FEBA03',
  },
});
