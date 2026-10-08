export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export const reglaNombre = {
  required: 'El nombre es obligatorio',
  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
};

export const reglaEmail = {
  required: 'El correo es obligatorio',
  pattern: { value: EMAIL_PATTERN, message: 'Correo inválido' },
};

export const reglaTelefonoOpcional = {
  minLength: { value: 7, message: 'Mínimo 7 caracteres' },
};

export const reglaContrasenaLogin = {
  required: 'La contraseña es obligatoria',
};

export const reglaContrasenaNueva = {
  required: 'La contraseña es obligatoria',
  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
};

export const reglaConfirmacion = (obtenerContrasena: () => string) => ({
  required: 'Confirma la contraseña',
  validate: (value: string) =>
    value === obtenerContrasena() || 'Las contraseñas no coinciden',
});

export const MENSAJE_CALIFICACION_REQUERIDA = 'Selecciona una calificación de 1 a 5 estrellas';

/** Devuelve el mensaje de error si no hay calificación seleccionada, o null si es válida. */
export function validarCalificacion(calificacion: number): string | null {
  return calificacion < 1 ? MENSAJE_CALIFICACION_REQUERIDA : null;
}

export interface ErroresSelecciones {
  categoria?: string;
  municipio?: string;
  ubicacion?: string;
}

interface Selecciones {
  categoriaId: string | null;
  municipioId: string | null;
  lat: number | null;
  lng: number | null;
}

/** Valida categoría, municipio y ubicación del formulario de servicio. Objeto vacío = todo válido. */
export function validarSelecciones({
  categoriaId,
  municipioId,
  lat,
  lng,
}: Selecciones): ErroresSelecciones {
  const errores: ErroresSelecciones = {};
  if (!categoriaId) errores.categoria = 'Selecciona una categoría';
  if (!municipioId) errores.municipio = 'Selecciona un municipio';
  if (lat === null || lng === null) errores.ubicacion = 'Selecciona la ubicación en el mapa';
  return errores;
}