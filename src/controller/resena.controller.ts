import type { Request, Response } from "express";
import { HttpStatusCode } from "../utils/httpStatus.js";
import {
  getResenas_get,
  getResenaById_get,
  getResenasByServicio_get,
  createResena_post,
  updateResena_put,
  deleteResena_delete,
} from "../models/resena.model.js";

// 🔹 GET all
export async function getResenas(req: Request, res: Response): Promise<Response> {
  try {
    const resenas = await getResenas_get();
    return res.status(HttpStatusCode.Ok).json({ data: resenas });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener reseñas" });
  }
}

// 🔹 GET by ID
export async function getResenaById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const resena = await getResenaById_get(id);

    if (!resena) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Reseña no encontrada" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: resena });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 GET by servicio
export async function getResenasByServicio(req: Request, res: Response): Promise<Response> {
  try {
    const { servicioId } = req.params;

    if (!servicioId) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro servicioId" });
    }

    const resenas = await getResenasByServicio_get(servicioId);
    return res.status(HttpStatusCode.Ok).json({ data: resenas });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 POST create
export async function createResena(req: Request, res: Response): Promise<Response> {
  try {
    const { usuario_id, servicio_id, calificacion, comentario } = req.body;

    const success = await createResena_post({
      usuario_id,
      servicio_id,
      calificacion,
      comentario,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear la reseña" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Reseña creada correctamente" });
  } catch (error: any) {
    console.error(error);
    return res.status(HttpStatusCode.BadRequest).json({ message: error.message || "Error al crear la reseña" });
  }
}

// 🔹 PUT update
export async function updateResena(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const { calificacion, comentario } = req.body;

    const success = await updateResena_put(id, { calificacion, comentario });

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Reseña no encontrada" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Reseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 DELETE
export async function deleteResena(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const success = await deleteResena_delete(id);

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Reseña no encontrada" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}