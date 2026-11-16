import type { Resena } from '../api/resena';

export function promedioPorServicio(
  resenas: Resena[],
): Record<string, { promedio: number; cantidad: number }> {
  const acumulado: Record<string, { suma: number; cantidad: number }> = {};

  for (const r of resenas) {
    const actual = acumulado[r.servicio_id] ?? { suma: 0, cantidad: 0 };
    actual.suma += r.calificacion;
    actual.cantidad += 1;
    acumulado[r.servicio_id] = actual;
  }

  const resultado: Record<string, { promedio: number; cantidad: number }> = {};
  for (const [id, { suma, cantidad }] of Object.entries(acumulado)) {
    resultado[id] = { promedio: suma / cantidad, cantidad };
  }
  return resultado;
}
