import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { IUsuario, IUsuarioConTipo, ICreateUsuarioInput} from "../interfaces/usuario.interface.js";

const COLLECTION = "usuarios";

export async function getUsuarios_get(): Promise<IUsuario[]> {
  const db = mongoConnector.getDb();
  return await db.collection<IUsuario>(COLLECTION).find({}).toArray();
}

export async function getUsuarioById_get(id: string): Promise<IUsuario | null> {
  const db = mongoConnector.getDb();
  return await db.collection<IUsuario>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function getUsuarioByEmail_get(email: string): Promise<IUsuario | null> {
  const db = mongoConnector.getDb();
  return await db.collection<IUsuario>(COLLECTION).findOne({ email });
}

export async function getUsuarioConTipoById_get(id: string): Promise<IUsuarioConTipo | null> {
  const db = mongoConnector.getDb();
  const resultado = await db.collection(COLLECTION).aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: "tipos_usuario",
        localField: "tipo_usuario_id",
        foreignField: "_id",
        as: "tipo"
      }
    },
    { $unwind: "$tipo" },
    { $addFields: { tipo_usuario: "$tipo.nombre" } },
    { $project: { tipo: 0 } }
  ]).toArray();

  return resultado[0] as IUsuarioConTipo ?? null;
}

export async function createUsuario_post(usuario: ICreateUsuarioInput): Promise<boolean> {
  try {
    const db = mongoConnector.getDb();

    const tipoUsuarioDoc = await db
      .collection("tipos_usuario")
      .findOne({ nombre: usuario.tipo_usuario });

    if (!tipoUsuarioDoc) {
      throw new Error(`Tipo de usuario "${usuario.tipo_usuario}" no existe`);
    }

    const { tipo_usuario, ...resto } = usuario;

    const doc: IUsuario = {
      ...resto,
      tipo_usuario_id: tipoUsuarioDoc._id,
      fecha_registro: new Date(),
    };

    const response = await db.collection<IUsuario>(COLLECTION).insertOne(doc);
    return response.acknowledged;
  } catch (error: any) {
    console.error("Error al crear usuario:", error.message);
    throw error;
  }
}

export async function updateUsuario_put(id: string, usuario: Partial<IUsuario>): Promise<boolean> {
  const db = mongoConnector.getDb();

  const cambios: any = Object.fromEntries(
    Object.entries(usuario).filter(([, v]) => v !== undefined)
  );

  if (cambios.tipo_usuario_id) {
    cambios.tipo_usuario_id = new ObjectId(cambios.tipo_usuario_id);
  }

  const response = await db.collection<IUsuario>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: cambios }
  );

  return response.matchedCount > 0;
}


export async function deleteUsuario_delete(id: string): Promise<boolean> {
  const db = mongoConnector.getDb();
  const response = await db.collection<IUsuario>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return response.deletedCount > 0;
}