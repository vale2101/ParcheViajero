import { StyleSheet } from 'react-native';

const AZUL = '#0147B9';
const AZUL_OSC = '#1E3A8A';
const ORO = '#FEBA03';
const CREMA = '#FDFBF6';
const SUP = '#FAF4E4';
const BORDE = '#E8D9B8';

export const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: CREMA,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  bloque: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  compacto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center',
    backgroundColor: CREMA,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BORDE,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  marca: {
    fontFamily: 'Fredoka_700Bold',
    fontSize: 18,
    color: AZUL,
    textAlign: 'center',
  },
  texto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b6b6b',
    textAlign: 'center',
  },
  textoCompacto: {
    fontSize: 13,
    fontWeight: '600',
    color: AZUL,
  },
  anilloCaja: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  anillo: {
    position: 'absolute',
    borderStyle: 'solid',
  },
  nucleo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SUP,
    borderWidth: 2,
    borderColor: BORDE,
  },
  logo: {
    width: '72%',
    height: '72%',
  },
});
