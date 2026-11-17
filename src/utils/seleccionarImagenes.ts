import * as ImagePicker from 'expo-image-picker';
import type { ImagenLocal } from '../api/servicio';

export const MAX_IMAGENES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const EXT_POR_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface ResultadoSeleccion {
  imagenes: ImagenLocal[];
  rechazadas: string[];
}

export async function elegirImagenes(cupo: number): Promise<ResultadoSeleccion> {
  if (cupo <= 0) {
    return { imagenes: [], rechazadas: [`Máximo ${MAX_IMAGENES} imágenes por servicio.`] };
  }

  const r = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: cupo,
    quality: 0.8, 
  });

  if (r.canceled) return { imagenes: [], rechazadas: [] };

  const imagenes: ImagenLocal[] = [];
  const rechazadas: string[] = [];

  r.assets.slice(0, cupo).forEach((a, i) => {
    const mime = a.mimeType ?? 'image/jpeg';
    const ext = EXT_POR_MIME[mime];

    if (!ext) {
      rechazadas.push('Solo se permiten imágenes JPG, PNG o WEBP.');
    } else if (a.fileSize !== undefined && a.fileSize > MAX_BYTES) {
      rechazadas.push('Una imagen supera los 5 MB y no se agregó.');
    } else {
      imagenes.push({ uri: a.uri, type: mime, name: `foto-${Date.now()}-${i}.${ext}` });
    }
  });

  return { imagenes, rechazadas: [...new Set(rechazadas)] };
}