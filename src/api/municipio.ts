import { request } from './client';

export interface Municipio {
  _id: string;
  nombre: string;
}

export async function getMunicipios(): Promise<{ data: Municipio[] }> {
  return request('/municipios/getMunicipios');
}

export async function getMunicipioById(id: string): Promise<{ data: Municipio }> {
  return request(`/municipios/findMunicipioById/${id}`);
}