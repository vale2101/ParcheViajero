import { ObjectId } from "mongodb";

export interface IResena {
  _id?: ObjectId;
  usuario_id: ObjectId;
  servicio_id: ObjectId;
  calificacion: number; 
  comentario?: string;
  fecha?: Date;
}


export interface ICreateResenaInput {
  usuario_id: string;
  servicio_id: string;
  calificacion: number;
  comentario?: string;
}