import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { ICategoria } from "../interfaces/categoria.interface.js";

const COLLECTION = "categorias";

// 🔹 GET all
export async function getCategorias_get(): Promise<ICategoria[]> {
  const db = mongoConnector.getDb();
  return db.collection<ICategoria>(COLLECTION).find().toArray();
}

// 🔹 GET by ID
export async function getCategoriaById_get(id: string): Promise<ICategoria | null> {
  const db = mongoConnector.getDb();
  return db.collection<ICategoria>(COLLECTION).findOne({ _id: new ObjectId(id) });
}