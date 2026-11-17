import type { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

export interface CategoriaVisual {
  emoji: string;
  color: string;
}

export interface CategoriaStickerVisual {
  icono: keyof typeof MaterialCommunityIcons.glyphMap;
  fondo: string;
  borde: string;
  texto: string;
}


const MAPA_CATEGORIAS: Record<string, CategoriaVisual> = {
  restaurante: { emoji: '🍴', color: '#0147B9' },
  hotel: { emoji: '🛏️', color: '#5B21B6' },
  'atractivo turístico': { emoji: '📍', color: '#059669' },
  cafetería: { emoji: '☕', color: '#92400E' },
  bar: { emoji: '🍺', color: '#B45309' },
};

const DEFAULT_VISUAL: CategoriaVisual = { emoji: '📍', color: '#0147B9' };

export const DESTACADO_VISUAL: CategoriaVisual = { emoji: '⭐', color: '#FEBA03' };

export function getCategoriaVisual(nombreCategoria?: string): CategoriaVisual {
  if (!nombreCategoria) return DEFAULT_VISUAL;
  return MAPA_CATEGORIAS[nombreCategoria.trim().toLowerCase()] ?? DEFAULT_VISUAL;
}

const STICKERS: Record<string, CategoriaStickerVisual> = {
  cafeteria: { icono: 'coffee-outline', fondo: colors.doradoSuave, borde: colors.dorado, texto: colors.doradoTexto },
  restaurante: { icono: 'silverware-fork-knife', fondo: '#FDE7D6', borde: '#E8C4A8', texto: '#8A3E12' },
  hotel: { icono: 'bed-outline', fondo: colors.azulSuave, borde: '#C5D7F6', texto: colors.azul },
  alojamiento: { icono: 'bed-outline', fondo: colors.azulSuave, borde: '#C5D7F6', texto: colors.azul },
  hospedaje: { icono: 'bed-outline', fondo: colors.azulSuave, borde: '#C5D7F6', texto: colors.azul },
  'atractivo turistico': { icono: 'terrain', fondo: colors.verdeSuave, borde: '#B7DFC9', texto: colors.verde },
  turismo: { icono: 'terrain', fondo: colors.verdeSuave, borde: '#B7DFC9', texto: colors.verde },
  bar: { icono: 'beer-outline', fondo: colors.beige, borde: colors.borde, texto: colors.azulOscuro },
};

const STICKER_GENERICO: CategoriaStickerVisual = {
  icono: 'tag-outline',
  fondo: colors.crema,
  borde: colors.borde,
  texto: colors.azulOscuro,
};

function claveCategoria(nombre: string): string {
  return nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getCategoriaSticker(nombreCategoria?: string): CategoriaStickerVisual {
  if (!nombreCategoria) return STICKER_GENERICO;
  return STICKERS[claveCategoria(nombreCategoria)] ?? STICKER_GENERICO;
}