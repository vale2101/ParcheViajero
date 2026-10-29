import { StyleSheet } from 'react-native';
import { sombra } from './theme';

export const styles = StyleSheet.create({
  sticker: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    maxWidth: '100%',
    gap: 5,
    marginVertical: 2,
    paddingLeft: 7,
    paddingRight: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    transform: [{ rotate: '-2deg' }],
    ...sombra,
  },
  texto: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
});
