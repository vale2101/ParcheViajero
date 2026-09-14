import type { Request, Response } from "express";
import { HttpStatusCode } from "../utils/httpStatus.js";
import {
  getServicios_get,
  getServicioById_get,
  createServicio_post,
  updateServicio_put,
  deleteServicio_delete,
} from "../models/servicio.model.js";

// 🔹 GET all
export async function getServicios(req: Request, res: Response): Promise<Response> {
  try {
    const servicios = await getServicios_get();
    return res.status(HttpStatusCode.Ok).json({ data: servicios });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener servicios" });
  }
}

// 🔹 GET by ID
export async function getServicioById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const servicio = await getServicioById_get(id);

    if (!servicio) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Servicio no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: servicio });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 POST create
export async function createServicio(req: Request, res: Response): Promise<Response> {
  try {
    const {
      usuario_id,
      categoria_id,
      municipio_id,
      nombre,
      descripcion,
      direccion,
      latitud,
      longitud,
      telefono,
      horario_atencion,
      precio,
    } = req.body;

    const success = await createServicio_post({
      usuario_id,
      categoria_id,
      municipio_id,
      nombre,
      descripcion,
      direccion,
      latitud,
      longitud,
      telefono,
      horario_atencion,
      precio,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear el servicio" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Servicio creado correctamente" });
  } catch (error: any) {
    console.error(error);
    return res.status(HttpStatusCode.BadRequest).json({ message: error.message || "Error al crear el servicio" });
  }
}

// 🔹 PUT update
export async function updateServicio(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const success = await updateServicio_put(id, req.body);

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Servicio no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Servicio actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 DELETE
export async function deleteServicio(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const success = await deleteServicio_delete(id);

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Servicio no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}