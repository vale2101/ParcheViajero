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

export function validarCalificacion(calificacion: number): string | null {
  return calificacion < 1 ? MENSAJE_CALIFICACION_REQUERIDA : null;
}