import type { Resena } from '../api/resena';

function texto(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : undefined;
}

export function idUsuarioResena(resena: Resena): string {
  const raw = resena.usuario_id as unknown;
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object' && '_id' in raw) {
    return String((raw as { _id: string })._id);
  }
  return '';
}

export function nombreAutorResena(
  resena: Resena,
  yo?: { _id: string; nombre: string } | null,
): string {
  const id = idUsuarioResena(resena);
  if (yo && id && yo._id === id) {
    const propio = texto(yo.nombre);
    if (propio) return propio;
  }

  const extra = resena as Resena & {
    autor_nombre?: unknown;
    usuario_nombre?: unknown;
    nombre_usuario?: unknown;
    usuario?: { nombre?: unknown };
  };

  const anidado =
    resena.usuario_id && typeof resena.usuario_id === 'object'
      ? (resena.usuario_id as { nombre?: unknown }).nombre
      : undefined;

  return (
    texto(extra.autor_nombre) ??
    texto(extra.usuario_nombre) ??
    texto(extra.nombre_usuario) ??
    texto(extra.usuario?.nombre) ??
    texto(anidado) ??
    'Usuario'
  );
}
