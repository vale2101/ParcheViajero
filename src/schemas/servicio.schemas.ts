import z from "zod";

const objectIdString = z
  .string()
  .nonempty("Este campo es obligatorio")
  .regex(/^[0-9a-fA-F]{24}$/, "Debe ser un ObjectId válido");

export const createServicioSchema = z.object({
  categoria_id: objectIdString,
  municipio_id: objectIdString,

  nombre: z
    .string()
    .nonempty("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),

  descripcion: z.string().optional(),
  direccion: z.string().optional(),

  latitud: z.number({ message: "La latitud debe ser un número" }),
  longitud: z.number({ message: "La longitud debe ser un número" }),

  telefono: z.string().optional(),
  horario_atencion: z.string().optional(),
  precio: z
    .number({ message: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0")
    .optional(),
});

export const updateServicioSchema = z.object({
  categoria_id: objectIdString.optional(),
  municipio_id: objectIdString.optional(),

  nombre: z.string().min(3, "Debe tener al menos 3 caracteres").optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),

  latitud: z.number({ message: "La latitud debe ser un número" }).optional(),
  longitud: z.number({ message: "La longitud debe ser un número" }).optional(),

  telefono: z.string().optional(),
  horario_atencion: z.string().optional(),
  precio: z
    .number({ message: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0")
    .optional(),
});