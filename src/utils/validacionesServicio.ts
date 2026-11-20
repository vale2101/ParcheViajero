export const PATRON_TELEFONO = /^[0-9+\s()-]{7,20}$/;

export const reglaNombreServicio = {
  required: 'El nombre es obligatorio',
  validate: (valor: string) =>
    valor.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres',
};

export const reglaDescripcion = {
  required: 'La descripción es obligatoria',
  validate: (valor: string) =>
    valor.trim().length >= 10 || 'La descripción debe tener al menos 10 caracteres',
};

export const reglaTelefonoServicio = {
  validate: (valor: string) =>
    !valor.trim() || PATRON_TELEFONO.test(valor.trim()) || 'Teléfono inválido (mínimo 7 dígitos)',
};

export type PrecioLeido =
  | { ok: true; vacio: true }
  | { ok: true; vacio: false; valor: number }
  | { ok: false; mensaje: string };

// Acepta enteros, decimales con punto o coma, y separadores de miles.
// Un campo vacío no se convierte en cero.
export function interpretarPrecio(crudo: string): PrecioLeido {
  const texto = crudo.trim().replace(/\s/g, '');
  if (!texto) return { ok: true, vacio: true };
  if (texto.startsWith('-')) return { ok: false, mensaje: 'El precio no puede ser negativo' };

  const coma = texto.lastIndexOf(',');
  const punto = texto.lastIndexOf('.');
  let normalizado = texto;

  if (coma !== -1 && punto !== -1) {
    normalizado =
      coma > punto
        ? texto.replace(/\./g, '').replace(',', '.')
        : texto.replace(/,/g, '');
  } else if (coma !== -1) {
    const partes = texto.split(',');
    const esMiles = partes.every((parte, i) =>
      i === 0 ? /^\d{1,3}$/.test(parte) : /^\d{3}$/.test(parte),
    );
    const esDecimal = partes.length === 2 && /^\d{1,2}$/.test(partes[1] ?? '');
    if (esDecimal) normalizado = `${partes[0]}.${partes[1]}`;
    else if (esMiles) normalizado = partes.join('');
    else return { ok: false, mensaje: 'El precio debe ser un número válido' };
  } else if (punto !== -1) {
    const partes = texto.split('.');
    const esMiles = partes.every((parte, i) =>
      i === 0 ? /^\d{1,3}$/.test(parte) : /^\d{3}$/.test(parte),
    );
    const esDecimal = partes.length === 2 && /^\d{1,2}$/.test(partes[1] ?? '');
    if (esDecimal) normalizado = texto;
    else if (esMiles) normalizado = partes.join('');
    else return { ok: false, mensaje: 'El precio debe ser un número válido' };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(normalizado)) {
    return { ok: false, mensaje: 'El precio debe ser un número válido' };
  }

  const valor = Number(normalizado);
  if (!Number.isFinite(valor)) return { ok: false, mensaje: 'El precio debe ser un número válido' };
  if (valor <= 0) return { ok: false, mensaje: 'El precio debe ser mayor a 0' };
  return { ok: true, vacio: false, valor };
}

export const reglaPrecio = {
  validate: (valor: string) => {
    const leido = interpretarPrecio(valor);
    return leido.ok || leido.mensaje;
  },
};
