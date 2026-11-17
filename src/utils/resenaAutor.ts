import type { Resena } from '../api/resena';

function texto(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : undefined;
}

function idDeValor(raw: unknown): string {
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (raw && typeof raw === 'object') {
    const o = raw as { _id?: unknown; id?: unknown };
    if (typeof o._id === 'string') return o._id;
    if (typeof o.id === 'string') return o.id;
  }
  return '';
}

function nombreDeObjeto(raw: unknown): string | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const o = raw as Record<string, unknown>;
  return (
    texto(o.nombre) ??
    texto(o.autor_nombre) ??
    texto(o.usuario_nombre) ??
    texto(o.nombre_usuario) ??
    texto(o.name) ??
    texto(o.nombre_completo)
  );
}

export function idUsuarioResena(resena: Resena): string {
  const extra = resena as Resena & { usuario?: unknown };
  return idDeValor(resena.usuario_id) || idDeValor(extra.usuario);
}

export function nombreEmbebidoAutor(
  resena: Resena,
  yo?: { _id: string; nombre: string } | null,
): string | undefined {
  const id = idUsuarioResena(resena);
  if (yo && id && yo._id === id) {
    const propio = texto(yo.nombre);
    if (propio) return propio;
  }

  const extra = resena as Resena & {
    autor_nombre?: unknown;
    usuario_nombre?: unknown;
    nombre_usuario?: unknown;
    usuario?: unknown;
  };

  return (
    texto(extra.autor_nombre) ??
    texto(extra.usuario_nombre) ??
    texto(extra.nombre_usuario) ??
    nombreDeObjeto(extra.usuario) ??
    nombreDeObjeto(resena.usuario_id)
  );
}

export function nombreAutorResena(
  resena: Resena,
  yo?: { _id: string; nombre: string } | null,
): string {
  return nombreEmbebidoAutor(resena, yo) ?? 'Usuario';
}
