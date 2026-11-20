import z from "zod";

const objectIdString = z
  .string()
  .nonempty("Este campo es obligatorio")
  .regex(/^[0-9a-fA-F]{24}$/, "Debe ser un ObjectId válido");

const vacioComoAusente = (valor: unknown) =>
  typeof valor === "string" && valor.trim() === "" ? undefined : valor;

const telefonoOpcional = z.preprocess(
  vacioComoAusente,
  z
    .string()
    .trim()
    .regex(/^[0-9+\s()-]{7,20}$/, "Teléfono inválido (mínimo 7 dígitos)")
    .optional(),
);

const horarioOpcional = z.preprocess(vacioComoAusente, z.string().trim().optional());

const precioOpcional = z
  .number({ message: "El precio debe ser un número válido" })
  .finite("El precio debe ser un número válido")
  .positive("El precio debe ser mayor a 0")
  .optional();

const coordenada = (mensaje: string) =>
  z.number({ message: mensaje }).finite("Las coordenadas no son válidas");

export const createServicioSchema = z.object({
  categoria_id: objectIdString,
  municipio_id: objectIdString,

  nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  direccion: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres"),

  latitud: coordenada("La latitud debe ser un número"),
  longitud: coordenada("La longitud debe ser un número"),

  telefono: telefonoOpcional,
  horario_atencion: horarioOpcional,
  precio: precioOpcional,
});

export const updateServicioSchema = z.object({
  categoria_id: objectIdString.optional(),
  municipio_id: objectIdString.optional(),

  nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .optional(),
  direccion: z.string().trim().min(5, "La dirección debe tener al menos 5 caracteres").optional(),

  latitud: coordenada("La latitud debe ser un número").optional(),
  longitud: coordenada("La longitud debe ser un número").optional(),

  telefono: telefonoOpcional,
  horario_atencion: horarioOpcional,
  precio: precioOpcional,
});