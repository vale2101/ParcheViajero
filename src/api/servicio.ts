import { request } from './client';

export interface Servicio {
  _id: string;
  usuario_id: string;
  categoria_id: string;
  municipio_id: string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  telefono?: string;
  horario_atencion?: string;
  precio?: number;
  fecha_creacion?: string;
}


export interface CreateServicioInput {
  categoria_id: string;
  municipio_id: string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  telefono?: string;
  horario_atencion?: string;
  precio?: number;
}

export type UpdateServicioInput = Partial<CreateServicioInput>;

interface MessageResponse {
  message: string;
}

export async function getServicios(): Promise<{ data: Servicio[] }> {
  return request('/servicios/getServicios');
}

export async function getServicioById(id: string): Promise<{ data: Servicio }> {
  return request(`/servicios/findServicioById/${id}`);
}

export async function createServicio(
  servicio: CreateServicioInput,
): Promise<MessageResponse> {
  return request<MessageResponse>('/servicios/createServicio', servicio, 'POST');
}

export async function updateServicio(
  id: string,
  cambios: UpdateServicioInput,
): Promise<MessageResponse> {
  return request<MessageResponse>(`/servicios/updateServicio/${id}`, cambios, 'PUT');
}

export async function deleteServicio(id: string): Promise<MessageResponse> {
  return request<MessageResponse>(`/servicios/delete/${id}`, undefined, 'DELETE');
}