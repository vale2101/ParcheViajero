import type { Resena } from '../api/resena';

export type OrdenResenas = 'recientes' | 'mejores';

function tiempo(r: Resena) {
  return r.fecha ? new Date(r.fecha).getTime() : 0;
}

// Devuelve una copia de la lista ordenada (no modifica la original)
export function ordenarResenas(resenas: Resena[], orden: OrdenResenas): Resena[] {
  const copia = [...resenas];

  if (orden === 'mejores') {
    return copia.sort((a, b) => b.calificacion - a.calificacion || tiempo(b) - tiempo(a));
  }

  return copia.sort((a, b) => tiempo(b) - tiempo(a));
}
