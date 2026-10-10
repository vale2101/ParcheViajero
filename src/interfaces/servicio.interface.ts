
import { ObjectId } from "mongodb";

export type EstadoAprobacion =
  | "pendiente"
  | "aprobado"
  | "rechazado";

export interface IUbicacionGeoJSON {
  type: "Point";
  coordinates: [number, number];
}

export interface IServicio {
  _id?: ObjectId;
  usuario_id: ObjectId;
  categoria_id: ObjectId;
  municipio_id: ObjectId;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  ubicacion: IUbicacionGeoJSON;
  telefono?: string;
  horario_atencion?: string;
  precio?: number;
  fecha_creacion?: Date;

  estado_aprobacion?: EstadoAprobacion;
  fecha_revision?: Date;
  revisado_por?: ObjectId;
  observacion_revision?: string;
}

export interface ICreateServicioInput {
  usuario_id: string;
  categoria_id: string;
  municipio_id: string;
  nombre: string;
  descripcion?: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  telefono?: string;
  horario_atencion?: string;
  precio?: number;
}
