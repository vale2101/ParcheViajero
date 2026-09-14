import type { Request, Response } from "express";
import { HttpStatusCode } from "../utils/httpStatus.js";
import { getCategorias_get, getCategoriaById_get } from "../models/categoria.model.js";

// 🔹 GET all
export async function getCategorias(req: Request, res: Response): Promise<Response> {
  try {
    const categorias = await getCategorias_get();
    return res.status(HttpStatusCode.Ok).json({ data: categorias });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener categorías" });
  }
}

// 🔹 GET by ID
export async function getCategoriaById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const categoria = await getCategoriaById_get(id);

    if (!categoria) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Categoría no encontrada" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: categoria });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}