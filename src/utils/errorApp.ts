export const MENSAJE_ERROR_DATOS =
  'No hemos podido obtener los datos. Inténtalo de nuevo.';

export const MENSAJE_ERROR_BASE =
  'Error en la base de datos. Inténtalo más tarde.';

export const MENSAJE_ERROR_CONEXION =
  'No hemos podido obtener los datos. Revisa tu conexión e inténtalo de nuevo.';

export const MENSAJE_ERROR_ACCION =
  'No hemos podido completar la acción. Inténtalo de nuevo.';

export const MENSAJE_ERROR_SESION =
  'Tu sesión expiró. Vuelve a iniciar sesión.';

export function logError(contexto: string, err: unknown): void {
  console.error(contexto, err);
}

export function esMensajeTecnico(texto: string): boolean {
  const t = texto.toLowerCase();

  return (
    /https?:\/\//.test(t) ||
    t.includes('localhost') ||
    t.includes('127.0.0.1') ||
    /\b\d{1,3}(?:\.\d{1,3}){3}\b/.test(t) ||
    t.includes('econnrefused') ||
    t.includes('enotfound') ||
    t.includes('network request failed') ||
    t.includes('failed to fetch') ||
    t.includes('mongodb') ||
    t.includes('mongoose') ||
    t.includes('sql') ||
    t.includes('stack trace') ||
    t.includes('/api') ||
    t.includes('internal server') ||
    /\berror\s+[45]\d\d\b/.test(t)
  );
}

export function mensajeErrorUsuario(
  err: unknown,
  fallback: string = MENSAJE_ERROR_DATOS,
): string {
  const raw =
    err instanceof Error ? err.message.trim() : String(err ?? '').trim();

  if (!raw || esMensajeTecnico(raw)) {
    return fallback;
  }

  return raw;
}
