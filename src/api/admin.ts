import { request } from './client';
import type { EstadoAprobacion, Servicio } from './servicio';

export type EstadoFiltro = EstadoAprobacion | 'todos';
export type TipoCuenta = 'negocio' | 'registrado';
export type Orden = 'asc' | 'desc';

export interface Propietario {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

export interface ServicioAdmin extends Servicio {
  categoria_nombre?: string;
  municipio_nombre?: string;
  propietario?: Propietario;
  revisado_por?: string;
}

export interface ResumenAdmin {
  pendientes: number;
  totalServicios: number;
  negocios: number;
  viajeros: number;
}

export interface RevisionEvento {
  _id: string;
  servicio_id: string;
  admin_id: string;
  admin_nombre?: string;
  estado_anterior: EstadoAprobacion;
  estado_nuevo: 'aprobado' | 'rechazado';
  observacion?: string;
  fecha: string;
}

export interface UsuarioAdmin {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
  foto_perfil?: string;
  fecha_registro?: string;
  tipo_usuario: TipoCuenta;
  total_servicios?: number;
}

export interface FiltrosServiciosAdmin {
  estado: EstadoFiltro;
  q: string;
  categoriaId: string | null;
  municipioId: string | null;
  desde: string | null;
}

function query(params: Record<string, string | null | undefined>): string {
  const partes = Object.entries(params)
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`);
  return partes.length ? `?${partes.join('&')}` : '';
}

export async function getResumenAdmin(): Promise<{ data: ResumenAdmin }> {
  return request('/admin/resumen');
}

export async function getServiciosAdmin(f: FiltrosServiciosAdmin): Promise<{ data: ServicioAdmin[] }> {
  return request(
    `/admin/servicios${query({
      estado: f.estado === 'todos' ? null : f.estado,
      q: f.q.trim(),
      categoria_id: f.categoriaId,
      municipio_id: f.municipioId,
      desde: f.desde,
    })}`,
  );
}

export async function getServicioAdmin(
  id: string,
): Promise<{ data: ServicioAdmin; historial: RevisionEvento[] }> {
  return request(`/admin/servicios/${id}`);
}

export async function revisarServicio(
  id: string,
  estado: 'aprobado' | 'rechazado',
  observacion?: string,
): Promise<{ message: string }> {
  return request(`/servicios/${id}/revision`, { estado_aprobacion: estado, observacion }, 'PUT');
}

export async function getUsuariosAdmin(
  tipo: TipoCuenta,
  q: string,
  orden: Orden,
): Promise<{ data: UsuarioAdmin[] }> {
  return request(`/admin/usuarios${query({ tipo, q: q.trim(), orden })}`);
}

export async function getUsuarioAdmin(
  id: string,
): Promise<{ data: UsuarioAdmin; servicios: ServicioAdmin[] }> {
  return request(`/admin/usuarios/${id}`);
}