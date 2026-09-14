import { ObjectId } from "mongodb";

export interface ICategoria {
  _id?: ObjectId;
  nombre: string;
  descripcion?: string;
}