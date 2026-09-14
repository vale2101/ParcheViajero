import { request } from './client';

export interface Categoria {
  _id: string;
  nombre: string;
  descripcion?: string;
}

export async function getCategorias(): Promise<{ data: Categoria[] }> {
  return request('/categorias/getCategorias');
}

export async function getCategoriaById(id: string): Promise<{ data: Categoria }> {
  return request(`/categorias/findCategoriaById/${id}`);
}