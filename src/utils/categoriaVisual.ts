export interface CategoriaVisual {
  emoji: string;
  color: string;
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