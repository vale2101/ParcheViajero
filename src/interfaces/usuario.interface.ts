import { ObjectId } from "mongodb";

export interface IUsuario {
  _id?: ObjectId;
  tipo_usuario_id: ObjectId;
  nombre: string;
  email: string;
  password_hash: string;
  telefono?: string;
  foto_perfil?: string;
  fecha_registro?: Date;
}

export interface IUsuarioConTipo extends IUsuario {
  tipo_usuario: string;
}

export interface ICreateUsuarioInput
  extends Omit<IUsuario, "tipo_usuario_id" | "_id" | "fecha_registro"> {
  tipo_usuario: string; 
}