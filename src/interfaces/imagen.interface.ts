import { ObjectId } from "mongodb";

export interface IImagenServicio {
  _id?: ObjectId;
  servicio_id: ObjectId;
  url_imagen: string;
  public_id: string;
  orden: number;
}