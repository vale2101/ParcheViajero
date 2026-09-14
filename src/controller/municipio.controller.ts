import type { Request, Response } from "express";
import { HttpStatusCode } from "../utils/httpStatus.js";
import { getMunicipios_get, getMunicipioById_get } from "../models/municipio.model.js";

// 🔹 GET all
export async function getMunicipios(req: Request, res: Response): Promise<Response> {
  try {
    const municipios = await getMunicipios_get();
    return res.status(HttpStatusCode.Ok).json({ data: municipios });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener municipios" });
  }
}

// 🔹 GET by ID
export async function getMunicipioById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const municipio = await getMunicipioById_get(id);

    if (!municipio) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Municipio no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: municipio });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}