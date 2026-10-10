
import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HttpStatusCode } from "../utils/httpStatus.js";

import {
  getServicios_get,
  getServicioById_get,
  createServicio_post,
  updateServicio_put,
  deleteServicio_delete,
  getServiciosByUsuarioId_get,
  revisarServicio_put,
} from "../models/servicio.model.js";

// GET: servicios aprobados para el mapa público
export async function getServicios(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const servicios = await getServicios_get();
    return res.status(HttpStatusCode.Ok).json({ data: servicios });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({
      message: "Error al obtener servicios",
    });
  }
}

// GET: servicio por ID
export async function getServicioById(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "Identificador de servicio inválido",
      });
    }

    const servicio = await getServicioById_get(id);

    if (!servicio) {
      return res.status(HttpStatusCode.NotFound).json({
        message: "Servicio no encontrado",
      });
    }

    return res.status(HttpStatusCode.Ok).json({ data: servicio });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({
      message: "Error al obtener el servicio",
    });
  }
}

// POST: crear servicio pendiente
export async function createServicio(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    if (!req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "No autenticado",
      });
    }

    const {
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
      usuario_id: req.userId,
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
      return res.status(HttpStatusCode.BadRequest).json({
        message: "No se pudo crear el servicio",
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message: "Servicio enviado a revisión",
    });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Error al crear el servicio";

    return res.status(HttpStatusCode.BadRequest).json({ message });
  }
}

// PUT: editar un servicio propio
export async function updateServicio(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "Identificador de servicio inválido",
      });
    }

    if (!req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "No autenticado",
      });
    }

    const success = await updateServicio_put(id, req.body, req.userId);

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({
        message: "Servicio no encontrado",
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message:
        "Servicio actualizado y enviado nuevamente a revisión",
    });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Error al actualizar el servicio";

    if (message.includes("permiso")) {
      return res.status(HttpStatusCode.Unauthorized).json({ message });
    }

    return res.status(HttpStatusCode.BadRequest).json({ message });
  }
}

// DELETE: eliminar un servicio propio
export async function deleteServicio(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "Identificador de servicio inválido",
      });
    }

    if (!req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "No autenticado",
      });
    }

    const success = await deleteServicio_delete(id, req.userId);

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({
        message: "Servicio no encontrado",
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message: "Servicio eliminado correctamente",
    });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Error al eliminar el servicio";

    if (message.includes("permiso")) {
      return res.status(HttpStatusCode.Unauthorized).json({ message });
    }

    return res.status(HttpStatusCode.InternalServerError).json({
      message: "Error al eliminar el servicio",
    });
  }
}

// GET: servicios del usuario autenticado, incluidos pendientes y rechazados
export async function getMisServicios(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    if (!req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "No autenticado",
      });
    }

    const servicios = await getServiciosByUsuarioId_get(req.userId);

    return res.status(HttpStatusCode.Ok).json({ data: servicios });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Error al obtener tus servicios";

    if (message.includes("inválido")) {
      return res.status(HttpStatusCode.BadRequest).json({ message });
    }

    return res.status(HttpStatusCode.InternalServerError).json({
      message: "Error al obtener tus servicios",
    });
  }
}

// PUT: aprobar o rechazar un servicio.
// La ruta DEBE utilizar middleware de autenticación y autorización de administrador.
export async function revisarServicio(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    if (!req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "No autenticado",
      });
    }

    const { id } = req.params;
    const { estado_aprobacion, observacion } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "Identificador de servicio inválido",
      });
    }

    if (
      estado_aprobacion !== "aprobado" &&
      estado_aprobacion !== "rechazado"
    ) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "El estado debe ser aprobado o rechazado",
      });
    }

    if (
      observacion !== undefined &&
      typeof observacion !== "string"
    ) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "La observación debe ser texto",
      });
    }

    if (
      estado_aprobacion === "rechazado" &&
      !observacion?.trim()
    ) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "Debes escribir el motivo del rechazo",
      });
    }

    const success = await revisarServicio_put(
      id,
      req.userId,
      estado_aprobacion,
      observacion,
    );

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({
        message:
          "No se pudo revisar el servicio. Puede que no exista o ya haya sido revisado.",
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message:
        estado_aprobacion === "aprobado"
          ? "Servicio aprobado correctamente"
          : "Servicio rechazado correctamente",
    });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Error al revisar el servicio";

    return res.status(HttpStatusCode.BadRequest).json({ message });
  }
}
