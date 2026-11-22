export interface MedidaPantalla {
  ancho: number;
  alto: number;
  estrecho: boolean;
  telefono: boolean;
  tablet: boolean;
  escritorio: boolean;
  pad: number;
  padSm: number;
  maxContenido: number;
  escala: number;
  columnas: number;
}

const BASE = 390;

export function medirPantalla(ancho: number, alto: number): MedidaPantalla {
  const estrecho = ancho < 360;
  const telefono = ancho < 600;
  const tablet = ancho >= 600 && ancho < 1024;
  const escritorio = ancho >= 1024;
  const escala = Math.min(1.2, Math.max(0.86, ancho / BASE));

  return {
    ancho,
    alto,
    estrecho,
    telefono,
    tablet,
    escritorio,
    pad: estrecho ? 12 : telefono ? 16 : 24,
    padSm: estrecho ? 8 : 12,
    maxContenido: escritorio ? 920 : 840,
    escala,
    columnas: escritorio ? 3 : tablet ? 2 : 1,
  };
}

export function escalar(n: number, escala: number) {
  return Math.round(n * escala);
}
