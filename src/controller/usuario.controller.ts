import type { Request, Response } from "express";
import { HttpStatusCode } from "../utils/httpStatus.js";
import {
  getUsuarios_get,
  getUsuarioById_get,
  getUsuarioByEmail_get,
  getUsuarioConTipoById_get,
  createUsuario_post,
  updateUsuario_put,
  deleteUsuario_delete,
} from "../models/usuario.model.js";
import type { ICreateUsuarioInput, IUsuario } from "../interfaces/usuario.interface.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "clave-secreta";

// 🔹 LOGIN
export async function loginUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { email, contrasena } = req.body;

    const usuario = await getUsuarioByEmail_get(email);

    if (!usuario) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.password_hash);

    if (!validPassword) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "Contraseña incorrecta" });
    }

    const usuarioConTipo = await getUsuarioConTipoById_get(usuario._id!.toString());

    const token = jwt.sign(
      {
        userId: usuario._id,
        tipo_usuario: usuarioConTipo?.tipo_usuario,
      },
      secretKey,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
      path: "/",
    });

    return res.status(HttpStatusCode.Ok).json({
      message: "Login exitoso",
      tipo_usuario: usuarioConTipo?.tipo_usuario,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 GET all
export async function getUsuarios(req: Request, res: Response): Promise<Response> {
  try {
    const usuarios = await getUsuarios_get();
    return res.status(HttpStatusCode.Ok).json({ data: usuarios });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener usuarios" });
  }
}

// 🔹 GET /me
export async function getCurrentUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const token = req.cookies.token ?? req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }

    const decoded: any = jwt.verify(token, secretKey);
    const usuario = await getUsuarioConTipoById_get(decoded.userId);

    if (!usuario) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Usuario no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: usuario });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al verificar sesión" });
  }
}

// 🔹 GET by ID
export async function getUsuarioById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const usuario = await getUsuarioById_get(id);

    if (!usuario) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Usuario no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: usuario });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 POST create
export async function createUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { nombre, email, contrasena, tipo_usuario, telefono } = req.body;

    if (!nombre || !email || !contrasena || !tipo_usuario) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Faltan campos requeridos" });
    }

    const password_hash = bcrypt.hashSync(contrasena, 10);

    const success = await createUsuario_post({
      nombre,
      email,
      password_hash,
      tipo_usuario,
      telefono,
    } satisfies ICreateUsuarioInput);

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear el usuario" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Usuario creado correctamente" });
  } catch (error: any) {
    console.error(error);

    if (error.message?.includes("no existe")) {
      return res.status(HttpStatusCode.BadRequest).json({ message: error.message });
    }

    if (error.code === 11000) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Ese correo ya está registrado" });
    }

    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 PUT update
export async function updateUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "Falta el parámetro id" });
    }

    const { nombre, email, contrasena, telefono } = req.body;

    const cambios: Partial<IUsuario> = {
      ...(nombre !== undefined && { nombre }),
      ...(email !== undefined && { email }),
      ...(telefono !== undefined && { telefono }),
      ...(contrasena && { password_hash: bcrypt.hashSync(contrasena, 10) }),
    };

    const success = await updateUsuario_put(id, cambios);

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo actualizar el usuario" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 DELETE
export async function deleteUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "El id es requerido" });
    }

    const success = await deleteUsuario_delete(id);

    if (!success) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Usuario no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 LOGOUT
export function logoutUsuario(req: Request, res: Response): Response {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(HttpStatusCode.Ok).json({ message: "Logout exitoso" });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al cerrar sesión" });
  }
}