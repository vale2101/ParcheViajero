import type { Resena } from '../api/resena';

export const MINIMO_RESENAS_PARA_DESTACAR = 3;

export function calcularDestacadoId(resenas: Resena[]): string | null {
  const acumulado: Record<string, { suma: number; cantidad: number }> = {};

  resenas.forEach((r) => {
    const actual = acumulado[r.servicio_id] ?? { suma: 0, cantidad: 0 };
    actual.suma += r.calificacion;
    actual.cantidad += 1;
    acumulado[r.servicio_id] = actual;
  });

  let mejorId: string | null = null;
  let mejorPromedio = 0;

  for (const [servicioId, { suma, cantidad }] of Object.entries(acumulado)) {
    if (cantidad < MINIMO_RESENAS_PARA_DESTACAR) continue;
    const promedio = suma / cantidad;
    if (promedio > mejorPromedio) {
      mejorPromedio = promedio;
      mejorId = servicioId;
    }
  }

  return mejorId;
}