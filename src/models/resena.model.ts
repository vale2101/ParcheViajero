import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { IResena, ICreateResenaInput } from "../interfaces/resena.interface.js";

const COLLECTION = "resenas";

// 🔹 GET all
export async function getResenas_get(): Promise<IResena[]> {
  const db = mongoConnector.getDb();
  return db.collection<IResena>(COLLECTION).find().toArray();
}

// 🔹 GET by ID
export async function getResenaById_get(id: string): Promise<IResena | null> {
  const db = mongoConnector.getDb();
  return db.collection<IResena>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

// 🔹 GET by servicio (usa el índice servicio_id: 1)
export async function getResenasByServicio_get(servicioId: string): Promise<IResena[]> {
  const db = mongoConnector.getDb();
  return db
    .collection<IResena>(COLLECTION)
    .find({ servicio_id: new ObjectId(servicioId) })
    .toArray();
}

// 🔹 POST create
export async function createResena_post(resena: ICreateResenaInput): Promise<boolean> {
  try {
    const db = mongoConnector.getDb();

    // Valida que el usuario exista
    const usuarioDoc = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(resena.usuario_id) });

    if (!usuarioDoc) {
      throw new Error("El usuario no existe");
    }

    // Valida que el servicio exista
    const servicioDoc = await db
      .collection("servicios")
      .findOne({ _id: new ObjectId(resena.servicio_id) });

    if (!servicioDoc) {
      throw new Error("El servicio no existe");
    }

    const doc: IResena = {
      usuario_id: new ObjectId(resena.usuario_id),
      servicio_id: new ObjectId(resena.servicio_id),
      calificacion: resena.calificacion,
      fecha: new Date(),
      ...(resena.comentario !== undefined && { comentario: resena.comentario }),
    };

    const response = await db.collection<IResena>(COLLECTION).insertOne(doc);
    return response.acknowledged;
  } catch (error: any) {
    // El índice único (usuario_id + servicio_id) lanza error de MongoDB con code 11000 si ya existe
    if (error.code === 11000) {
      throw new Error("Este usuario ya dejó una reseña para este servicio");
    }
    console.error("Error al crear reseña:", error.message);
    throw error;
  }
}

// 🔹 PUT update
export async function updateResena_put(
  id: string,
  cambios: Partial<Pick<IResena, "calificacion" | "comentario">>
): Promise<boolean> {
  const db = mongoConnector.getDb();

  const datos = Object.fromEntries(
    Object.entries(cambios).filter(([, v]) => v !== undefined)
  );

  const response = await db
    .collection<IResena>(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: datos });

  return response.matchedCount > 0;
}

// 🔹 DELETE
export async function deleteResena_delete(id: string): Promise<boolean> {
  const db = mongoConnector.getDb();
  const response = await db.collection<IResena>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return response.deletedCount > 0;
}