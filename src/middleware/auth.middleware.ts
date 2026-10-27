import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../utils/httpStatus.js";

const secretKey: string = process.env.JWT_SECRET ?? "";

if (!secretKey) {
  throw new Error("La variable JWT_SECRET no esta configurada");
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      tipoUsuario?: string;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  try {
    const token =
      req.cookies?.token ??
      req.headers.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "No autenticado",
      });
    }

    const decoded = jwt.verify(token, secretKey);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string"
    ) {
      return res.status(HttpStatusCode.Unauthorized).json({
        message: "Token invalido",
      });
    }

    req.userId = decoded.userId;
    req.tipoUsuario = decoded.tipo_usuario;

    next();
  } catch {
    return res.status(HttpStatusCode.Unauthorized).json({
      message: "Token invalido o expirado",
    });
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (!req.userId) {
    return res.status(HttpStatusCode.Unauthorized).json({
      message: "No autenticado",
    });
  }

  if (req.tipoUsuario?.toLowerCase() !== "admin") {
    return res.status(HttpStatusCode.Forbidden).json({
      message: "No tienes permisos de administrador",
    });
  }

  next();
}
