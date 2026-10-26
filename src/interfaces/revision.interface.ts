import { ObjectId } from "mongodb";
import type { EstadoAprobacion } from "./servicio.interface.js";

export interface IRevisionServicio {
  _id?: ObjectId;
  servicio_id: ObjectId;
  admin_id: ObjectId;
  estado_anterior: EstadoAprobacion;
  estado_nuevo: "aprobado" | "rechazado";
  observacion?: string;
  fecha: Date;
}