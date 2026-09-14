import z from "zod";

export const createUsuarioSchema = z.object({
  nombre: z
    .string()
    .nonempty("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),

  email: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("El correo debe tener un formato válido"),

  contrasena: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),

  tipo_usuario: z
    .enum(["negocio", "registrado"], {
      message: "El tipo de usuario debe ser 'negocio' o 'registrado'",
    }),

  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .optional(),
});

export const updateUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3, "Debe tener al menos 3 caracteres")
    .optional(),

  email: z
    .string()
    .email("Correo inválido")
    .optional(),

  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional(),

  telefono: z
    .string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .optional(),
});

export const loginUsuarioSchema = z.object({
  email: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("Debe ingresar un correo válido"),

  contrasena: z
    .string()
    .nonempty("La contraseña es obligatoria"),
});