export function formatearFecha(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

export function formatearFechaHora(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

export function iniciales(nombre?: string): string {
  const p = (nombre ?? '').trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return '?';
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}

export const ETIQUETA_TIPO: Record<string, string> = {
  negocio: 'Negocio',
  registrado: 'Viajero',
  admin: 'Administrador',
};