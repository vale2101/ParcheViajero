import z from "zod";

const objectIdString = z
  .string()
  .nonempty("Este campo es obligatorio")
  .regex(/^[0-9a-fA-F]{24}$/, "Debe ser un ObjectId válido");

export const createResenaSchema = z.object({
  usuario_id: objectIdString,
  servicio_id: objectIdString,

  calificacion: z
    .number({ message: "La calificación debe ser un número" })
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),

  comentario: z.string().optional(),
});

export const updateResenaSchema = z.object({
  calificacion: z
    .number({ message: "La calificación debe ser un número" })
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5")
    .optional(),

  comentario: z.string().optional(),
});