// Paleta compartida (cuaderno de viaje: crema, azul y dorado)
export const colors = {
  azul: '#064BC2',
  azulOscuro: '#123B79',
  azulSuave: '#E8F0FD',
  crema: '#FFF8E9',
  beige: '#F8EEDB',
  fondo: '#F4F0E6',
  superficie: '#FFFBF1',
  dorado: '#E9B85B',
  doradoSuave: '#FFF1CF',
  doradoTexto: '#8A5A00',
  borde: '#E8D4AE',
  verde: '#047857',
  verdeSuave: '#E3F4EC',
  rojo: '#B91C1C',
  rojoSuave: '#FDE8E8',
  rojoBorde: '#ef4444',
  texto: '#1B2A41',
  textoSec: '#5F6F8A',
  placeholder: '#8C98AE',
  primario: '#064BC2',
  secundario: '#E9B85B',
  exito: '#047857',
  error: '#B91C1C',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const typography = {
  titulo: { fontSize: 22, fontWeight: '800' as const, color: colors.azulOscuro },
  subtitulo: { fontSize: 16, fontWeight: '700' as const, color: colors.azulOscuro },
  cuerpo: { fontSize: 14, fontWeight: '400' as const, color: colors.texto },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textoSec },
} as const;

export const sombra = {
  shadowColor: '#5B4A1F',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 6,
  elevation: 2,
} as const;

export const shadows = {
  suave: sombra,
} as const;
