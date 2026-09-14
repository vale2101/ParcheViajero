import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { IMunicipio } from "../interfaces/municipio.interface.js";

const COLLECTION = "municipios";

// 🔹 GET all
export async function getMunicipios_get(): Promise<IMunicipio[]> {
  const db = mongoConnector.getDb();
  return db.collection<IMunicipio>(COLLECTION).find().toArray();
}

// 🔹 GET by ID
export async function getMunicipioById_get(id: string): Promise<IMunicipio | null> {
  const db = mongoConnector.getDb();
  return db.collection<IMunicipio>(COLLECTION).findOne({ _id: new ObjectId(id) });
}