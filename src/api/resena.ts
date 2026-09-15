import { request } from './client';

export interface Resena {
  _id: string;
  usuario_id: string;
  servicio_id: string;
  calificacion: number;
  comentario?: string;
  fecha?: string;
}

export interface CreateResenaInput {
  usuario_id: string;
  servicio_id: string;
  calificacion: number;
  comentario?: string;
}

export type UpdateResenaInput = Partial<Pick<CreateResenaInput, 'calificacion' | 'comentario'>>;

export async function getResenas(): Promise<{ data: Resena[] }> {
  return request('/resenas/getResenas');
}

export async function getResenasByServicio(servicioId: string): Promise<{ data: Resena[] }> {
  return request(`/resenas/findResenasByServicio/${servicioId}`);
}

export async function createResena(resena: CreateResenaInput): Promise<{ message: string }> {
  return request('/resenas/createResena', resena, 'POST');
}

export async function updateResena(
  id: string,
  cambios: UpdateResenaInput,
): Promise<{ message: string }> {
  return request(`/resenas/updateResena/${id}`, cambios, 'PUT');
}

export async function deleteResena(id: string): Promise<{ message: string }> {
  return request(`/resenas/delete/${id}`, undefined, 'DELETE');
}