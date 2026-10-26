import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { HttpStatusCode } from "../utils/httpStatus.js";
import {
  getResumen_get,
  listarServicios_get,
  getServicioAdmin_get,
  listarUsuarios_get,
  getUsuarioAdmin_get,
  listarResenas_get,

  type Orden,
} from "../models/admin.model.js";
import { deleteResena_delete } from "../models/resena.model.js";
const texto = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

const orden = (v: unknown): Orden | undefined =>
  v === "asc" || v === "desc" ? v : undefined;

function error500(res: Response, error: unknown, message: string): Response {
  console.error(error);
  return res.status(HttpStatusCode.InternalServerError).json({ message });
}

export async function getResumen(req: Request, res: Response): Promise<Response> {
  try {
    return res.status(HttpStatusCode.Ok).json({ data: await getResumen_get() });
  } catch (error) {
    return error500(res, error, "Error al obtener el resumen");
  }
}

export async function listarServicios(req: Request, res: Response): Promise<Response> {
  try {
    const data = await listarServicios_get({
      estado: texto(req.query["estado"]),
      q: texto(req.query["q"]),
      categoriaId: texto(req.query["categoria_id"]),
      municipioId: texto(req.query["municipio_id"]),
      desde: texto(req.query["desde"]),
      orden: orden(req.query["orden"]),
    });
    return res.status(HttpStatusCode.Ok).json({ data });
  } catch (error) {
    return error500(res, error, "Error al obtener los servicios");
  }
}

export async function getServicioAdmin(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Identificador inválido" });
    }

    const resultado = await getServicioAdmin_get(id);
    if (!resultado) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Servicio no encontrado" });
    }

    return res
      .status(HttpStatusCode.Ok)
      .json({ data: resultado.servicio, historial: resultado.historial });
  } catch (error) {
    return error500(res, error, "Error al obtener el servicio");
  }
}

export async function listarUsuarios(req: Request, res: Response): Promise<Response> {
  try {
    const tipo = req.query["tipo"];
    if (tipo !== "negocio" && tipo !== "registrado") {
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: "El tipo debe ser negocio o registrado" });
    }

    const data = await listarUsuarios_get(
      tipo,
      texto(req.query["q"]),
      orden(req.query["orden"]) ?? "desc",
    );
    return res.status(HttpStatusCode.Ok).json({ data });
  } catch (error) {
    return error500(res, error, "Error al obtener los usuarios");
  }
}

export async function getUsuarioAdmin(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Identificador inválido" });
    }

    const resultado = await getUsuarioAdmin_get(id);
    if (!resultado) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Usuario no encontrado" });
    }

    return res
      .status(HttpStatusCode.Ok)
      .json({ data: resultado.usuario, servicios: resultado.servicios });
  } catch (error) {
    return error500(res, error, "Error al obtener el usuario");
  }
}
export async function listarResenas(req: Request, res: Response): Promise<Response> {
  try {
    const crudo = texto(req.query["calificacion"]);
    const calificacion = crudo !== undefined ? Number(crudo) : undefined;

    const data = await listarResenas_get(
      texto(req.query["q"]),
      calificacion,
      orden(req.query["orden"]) ?? "desc",
    );
    return res.status(HttpStatusCode.Ok).json({ data });
  } catch (error) {
    return error500(res, error, "Error al obtener las reseñas");
  }
}

export async function eliminarResena(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Identificador inválido" });
    }

    const eliminada = await deleteResena_delete(id);
    if (!eliminada) {
      return res.status(HttpStatusCode.NotFound).json({ message: "La reseña no existe o ya fue eliminada" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    return error500(res, error, "Error al eliminar la reseña");
  }
}