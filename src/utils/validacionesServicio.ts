export const PATRON_TELEFONO = /^[0-9+\s()-]{7,20}$/;
export const PATRON_PRECIO = /^\d+$/;

export const reglaDescripcion = {
  required: 'La descripción es obligatoria',
  minLength: { value: 10, message: 'Cuéntanos un poco más (mínimo 10 caracteres)' },
};

export const reglaTelefonoServicio = {
  pattern: { value: PATRON_TELEFONO, message: 'Teléfono inválido (mínimo 7 dígitos)' },
};

export const reglaPrecio = {
  pattern: { value: PATRON_PRECIO, message: 'Solo números, sin puntos ni comas (ej. 25000)' },
  validate: (v: string) => !v || Number(v) > 0 || 'El precio debe ser mayor a 0',
};