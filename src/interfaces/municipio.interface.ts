import { ObjectId } from "mongodb";

export interface IMunicipio {
  _id?: ObjectId;
  nombre: string;
}