import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../utils/httpStatus.js";

const secretKey = process.env.JWT_SECRET || "clave-secreta";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tipoUsuario?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): Response | void {
  try {
    const token =
      req.cookies?.token ?? req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }

    const decoded: any = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    req.tipoUsuario = decoded.tipo_usuario;

    next();
  } catch (error) {
    return res.status(HttpStatusCode.Unauthorized).json({ message: "Token inválido o expirado" });
  }
}