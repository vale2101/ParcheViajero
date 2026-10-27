import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { IImagenServicio } from "../interfaces/imagen.interface.js";
import type { IServicio } from "../interfaces/servicio.interface.js";

const COLLECTION = "imagenes_servicio";
export const MAX_IMAGENES = 6;

export async function getImagenesByServicio_get(servicioId: string): Promise<IImagenServicio[]> {
  if (!ObjectId.isValid(servicioId)) throw new Error("Identificador de servicio inválido");
  return mongoConnector
    .getDb()
    .collection<IImagenServicio>(COLLECTION)
    .find({ servicio_id: new ObjectId(servicioId) })
    .sort({ orden: 1 })
    .toArray();
}

export async function validarCupoImagenes(
  servicioId: string,
  usuarioId: string,
  nuevas: number,
): Promise<number> {
  if (!ObjectId.isValid(servicioId)) throw new Error("Identificador de servicio inválido");
  const db = mongoConnector.getDb();

  const servicio = await db
    .collection<IServicio>("servicios")
    .findOne({ _id: new ObjectId(servicioId) });

  if (!servicio) throw new Error("Servicio no encontrado");
  if (servicio.usuario_id.toString() !== usuarioId) {
    throw new Error("No tienes permiso para editar este servicio");
  }

  const actuales = await db
    .collection(COLLECTION)
    .countDocuments({ servicio_id: servicio._id! });

  if (actuales + nuevas > MAX_IMAGENES) {
    throw new Error(`Máximo ${MAX_IMAGENES} imágenes por servicio`);
  }
  return actuales;
}

export async function addImagenes_post(
  servicioId: string,
  imagenes: { url: string; public_id: string }[],
  ordenInicial: number,
): Promise<IImagenServicio[]> {
  const docs: IImagenServicio[] = imagenes.map((img, i) => ({
    servicio_id: new ObjectId(servicioId),
    url_imagen: img.url,
    public_id: img.public_id,
    orden: ordenInicial + i,
  }));
  await mongoConnector.getDb().collection<IImagenServicio>(COLLECTION).insertMany(docs);
  return docs;
}

export async function deleteImagen_delete(
  imagenId: string,
  usuarioId: string,
): Promise<string | null> {
  if (!ObjectId.isValid(imagenId)) throw new Error("Identificador inválido");
  const db = mongoConnector.getDb();
  const col = db.collection<IImagenServicio>(COLLECTION);

  const imagen = await col.findOne({ _id: new ObjectId(imagenId) });
  if (!imagen) return null;

  const servicio = await db
    .collection<IServicio>("servicios")
    .findOne({ _id: imagen.servicio_id });

  if (!servicio || servicio.usuario_id.toString() !== usuarioId) {
    throw new Error("No tienes permiso para editar este servicio");
  }

  await col.deleteOne({ _id: imagen._id! });
  return imagen.public_id;
}

// Al borrar un servicio completo
export async function deleteImagenesByServicio_delete(servicioId: ObjectId): Promise<string[]> {
  const col = mongoConnector.getDb().collection<IImagenServicio>(COLLECTION);
  const imgs = await col.find({ servicio_id: servicioId }).toArray();
  await col.deleteMany({ servicio_id: servicioId });
  return imgs.map((i) => i.public_id);
}