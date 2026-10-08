import { useMemo } from 'react';
import type { Resena } from '../api/resena';

// Calcula el promedio, el total y cuántas reseñas hay de cada estrella
export function useResumenResenas(resenas: Resena[]) {
  return useMemo(() => {
    const conteo = [0, 0, 0, 0, 0]; // posición 0 = 1 estrella ... posición 4 = 5 estrellas
    let suma = 0;

    resenas.forEach((r) => {
      const estrellas = Math.min(5, Math.max(1, Math.round(r.calificacion)));
      conteo[estrellas - 1] += 1;
      suma += r.calificacion;
    });

    const total = resenas.length;
    const promedio = total > 0 ? suma / total : 0;

    return { total, promedio, conteo };
  }, [resenas]);
}
