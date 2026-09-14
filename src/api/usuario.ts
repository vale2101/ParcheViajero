import { request } from './client';

export type TipoUsuario = 'negocio' | 'registrado';

export interface Usuario {
  _id: string;
  tipo_usuario_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  foto_perfil?: string;
  fecha_registro?: string;
}

interface LoginResponse {
  message: string;
  tipo_usuario: TipoUsuario;
  token: string;
}

interface CreateUsuarioResponse {
  message: string;
}

export async function login(
  email: string,
  contrasena: string,
): Promise<{ token: string; tipoUsuario: TipoUsuario; message: string }> {
  const data = await request<LoginResponse>('/usuarios/login', {
    email,
    contrasena,
  });
  return { token: data.token, tipoUsuario: data.tipo_usuario, message: data.message };
}

export async function register(
  nombre: string,
  email: string,
  contrasena: string,
  tipo_usuario: TipoUsuario,
  telefono?: string,
): Promise<{ message: string }> {
  return request<CreateUsuarioResponse>('/usuarios/createUsuario', {
    nombre,
    email,
    contrasena,
    tipo_usuario,
    telefono,
  });
}

export async function updateUsuario(
  id: string,
  cambios: { nombre?: string; email?: string; contrasena?: string; telefono?: string },
): Promise<{ message: string }> {
  return request<{ message: string }>(`/usuarios/updateUsuario/${id}`, cambios, 'PUT');
}

export async function deleteUsuario(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/usuarios/delete/${id}`, undefined, 'DELETE');
}

export async function logout(): Promise<{ message: string }> {
  return request<{ message: string }>('/usuarios/logout', {}, 'POST');
}

export async function getCurrentUsuario(): Promise<{ data: Usuario & { tipo_usuario: TipoUsuario } }> {
  return request(`/usuarios/me`);
}

export async function getUsuarios(): Promise<{ data: Usuario[] }> {
  return request('/usuarios/getUsuarios');
}

export async function getUsuarioById(id: string): Promise<{ data: Usuario }> {
  return request(`/usuarios/findUsuarioById/${id}`);
}