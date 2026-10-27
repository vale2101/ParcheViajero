
import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HttpStatusCode } from "../utils/httpStatus.js";
import { subirImagen, borrarImagen } from "../utils/cloudinary.js";
import {
  getImagenesByServicio_get,
  validarCupoImagenes,
  addImagenes_post,
  deleteImagen_delete,
} from "../models/imagen.model.js";
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

    const id = await createServicio_post({
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

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "No se pudo crear el servicio",
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message: "Servicio enviado a revisión",
      data: { _id: id },
    });
    
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Error al crear el servicio";

    return res.status(HttpStatusCode.BadRequest).json({ message });
  }
}

// PUT: editar un servicio propio
// El modelo decide si el cambio requiere nueva revisión (nombre, categoría o ubicación).
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
      message: "Servicio actualizado correctamente",
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
// La ruta usa requireAuth + requireAdmin.
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

    if (observacion !== undefined && typeof observacion !== "string") {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "La observación debe ser texto",
      });
    }

    if (estado_aprobacion === "rechazado" && !observacion?.trim()) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "Debes escribir el motivo del rechazo",
      });
    }

    const resultado = await revisarServicio_put(
      id,
      req.userId,
      estado_aprobacion,
      observacion,
    );

    if (resultado.resultado === "no_encontrado") {
      return res.status(HttpStatusCode.NotFound).json({
        message: "Servicio no encontrado",
      });
    }

    if (resultado.resultado === "estado_cambiado") {
      return res.status(HttpStatusCode.Conflict).json({
        message:
          "Este servicio ya fue revisado desde otra sesión. Se actualizaron los datos.",
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

// GET: imágenes de un servicio
export async function getImagenesServicio(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el id" });
    }
    const data = await getImagenesByServicio_get(id);
    return res.status(HttpStatusCode.Ok).json({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al obtener imágenes";
    return res.status(HttpStatusCode.BadRequest).json({ message });
  }
}

// POST: agregar imágenes (multipart, campo "imagenes")
export async function addImagenesServicio(req: Request, res: Response): Promise<Response> {
  const subidas: { url: string; public_id: string }[] = [];
  try {
    const { id } = req.params;
    const archivos = (req.files as Express.Multer.File[] | undefined) ?? [];

    if (!id || !req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }
    if (archivos.length === 0) {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: "No enviaste imágenes (campo 'imagenes')" });
    }

    const actuales = await validarCupoImagenes(id, req.userId, archivos.length);

    for (const f of archivos) {
      subidas.push(await subirImagen(f.buffer, "servicios"));
    }

    const docs = await addImagenes_post(id, subidas, actuales);
    return res.status(HttpStatusCode.Ok).json({ message: "Imágenes agregadas", data: docs });
  } catch (error: unknown) {
    await Promise.all(subidas.map((s) => borrarImagen(s.public_id))); // limpia lo ya subido
    const message = error instanceof Error ? error.message : "Error al subir imágenes";
    const status = message.includes("permiso")
      ? HttpStatusCode.Forbidden
      : HttpStatusCode.BadRequest;
    return res.status(status).json({ message });
  }
}

// DELETE: eliminar una imagen
export async function deleteImagenServicio(req: Request, res: Response): Promise<Response> {
  try {
    const { imagenId } = req.params;

    if (!imagenId || !req.userId) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }

    const publicId = await deleteImagen_delete(imagenId, req.userId);
    if (!publicId) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Imagen no encontrada" });
    }

    await borrarImagen(publicId);
    return res.status(HttpStatusCode.Ok).json({ message: "Imagen eliminada" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al eliminar la imagen";
    const status = message.includes("permiso")
      ? HttpStatusCode.Forbidden
      : HttpStatusCode.BadRequest;
    return res.status(status).json({ message });
  }
}