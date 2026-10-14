// Datos de prueba para la vista de reseñas del negocio.
// Cuando el backend esté listo, solo hay que cambiar el cuerpo de
// getResenasNegocio() para que llame a la API. El resto no se toca.

export interface ResenaNegocio {
  _id: string;
  clienteNombre: string;
  clienteFoto?: string; // URL de la foto; si no hay, se muestra la inicial
  calificacion: number; // de 1 a 5
  comentario?: string;
  fecha: string; // formato ISO: 2026-10-10
}

export const RESENAS_NEGOCIO_DEMO: ResenaNegocio[] = [
  {
    _id: 'r1',
    clienteNombre: 'María López',
    clienteFoto: undefined,
    calificacion: 5,
    comentario: 'Estuvo muy buena la comida, el mondongo delicioso y las porciones generosas.',
    fecha: '2026-10-10',
  },
  {
    _id: 'r2',
    clienteNombre: 'Carlos Ramírez',
    clienteFoto: undefined,
    calificacion: 3,
    comentario: 'La comida estaba rica, pero faltó servicio al cliente. Tardaron mucho en atendernos.',
    fecha: '2026-10-08',
  },
  {
    _id: 'r3',
    clienteNombre: 'Laura Gómez',
    clienteFoto: undefined,
    calificacion: 4,
    comentario: 'Buen ambiente familiar, volveré pronto.',
    fecha: '2026-10-05',
  },
  {
    _id: 'r4',
    clienteNombre: 'Andrés Torres',
    clienteFoto: undefined,
    calificacion: 5,
    comentario: 'Excelente atención y sabor casero.',
    fecha: '2026-09-30',
  },
];

// Hoy devuelve los datos de prueba.
// Después: reemplazar por algo como
//   const { data } = await getResenasByServicio(servicioId);
//   return data.map(...);  // convertir al formato ResenaNegocio
export async function getResenasNegocio(): Promise<ResenaNegocio[]> {
  return RESENAS_NEGOCIO_DEMO;
}
