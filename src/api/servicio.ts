import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import { request, requestForm } from './client';
import { notificarServiciosCambiados } from '../utils/serviciosSync';

export type EstadoAprobacion = 'pendiente' | 'aprobado' | 'rechazado';

export interface ImagenServicio {
  _id: string;
  url_imagen: string;
}

export interface ImagenLocal {
  uri: string;
  name: string;
  type: string;
}

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
  estado_aprobacion?: EstadoAprobacion;
  fecha_revision?: string;
  observacion_revision?: string;
  imagenes?: ImagenServicio[];
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
): Promise<MessageResponse & { data?: { _id: string } }> {
  const resultado = await request<MessageResponse & { data?: { _id: string } }>(
    '/servicios/createServicio',
    servicio,
    'POST',
  );
  notificarServiciosCambiados();
  return resultado;
}

export async function updateServicio(
  id: string,
  cambios: UpdateServicioInput,
): Promise<MessageResponse> {
  const resultado = await request<MessageResponse>(`/servicios/updateServicio/${id}`, cambios, 'PUT');
  notificarServiciosCambiados();
  return resultado;
}

export async function deleteServicio(id: string): Promise<MessageResponse> {
  const resultado = await request<MessageResponse>(`/servicios/delete/${id}`, undefined, 'DELETE');
  notificarServiciosCambiados();
  return resultado;
}

export async function getServiciosByUsuarioId_get(): Promise<{ data: Servicio[] }> {
  return request('/servicios/mis-servicios');
}

async function archivoNativo(img: ImagenLocal): Promise<File> {
  const origen = new File(img.uri);
  if (origen.exists && img.uri.startsWith('file:')) return origen;

  const destino = new File(Paths.cache, img.name);
  if (destino.exists) destino.delete();

  try {
    await origen.copy(destino);
    if (destino.exists) return destino;
  } catch {
    // La galería de Android entrega content://. Si no se puede copiar, se lee y se guarda en caché.
  }

  if (!destino.exists) destino.create();
  await destino.write(await origen.bytes());
  return destino;
}

export async function subirImagenesServicio(
  servicioId: string,
  imagenes: ImagenLocal[],
): Promise<{ message: string; data: ImagenServicio[] }> {
  const form = new FormData();

  for (const img of imagenes) {
    if (Platform.OS === 'web') {
      const blob = await (await fetch(img.uri)).blob();
      form.append('imagenes', blob, img.name);
    } else {
      form.append('imagenes', await archivoNativo(img), img.name);
    }
  }

  const resultado = await requestForm<{ message: string; data: ImagenServicio[] }>(
    `/servicios/${servicioId}/imagenes`,
    form,
  );
  notificarServiciosCambiados();
  return resultado;
}

export async function eliminarImagenServicio(imagenId: string): Promise<MessageResponse> {
  const resultado = await request<MessageResponse>(
    `/servicios/imagenes/${imagenId}`,
    undefined,
    'DELETE',
  );
  notificarServiciosCambiados();
  return resultado;
}

export const getMisServicios = getServiciosByUsuarioId_get;
