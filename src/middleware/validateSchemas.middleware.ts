import type { Request, Response, NextFunction } from "express";
import type { ZodObject, ZodRawShape } from "zod";
import { ZodError } from "zod";
import { HttpStatusCode } from "axios"; 

export const validateSchema =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(HttpStatusCode.BadRequest).json({
          error: error.issues.map((e) => e.message),
        });
      }
      return res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: "Error al validar los datos" });
    }
  };