// Datos de prueba para la sección de favoritos.
// Cuando el backend tenga favoritos, solo hay que cambiar el cuerpo de
// getFavoritos() para que llame a la API. El resto no se toca.

export interface Favorito {
  _id: string;
  nombre: string;
  municipio: string;
  categoria: string; // debe coincidir con el nombre de la categoría (Restaurante, Hotel...)
}

export const FAVORITOS_DEMO: Favorito[] = [
  { _id: 'f1', nombre: 'Mondongos y más', municipio: 'Manizales', categoria: 'Restaurante' },
  { _id: 'f2', nombre: 'Hotel Termales', municipio: 'Villamaría', categoria: 'Hotel' },
  { _id: 'f3', nombre: 'Café La Cima', municipio: 'Manizales', categoria: 'Cafetería' },
  { _id: 'f4', nombre: 'Bar El Parche', municipio: 'Chinchiná', categoria: 'Bar' },
  { _id: 'f5', nombre: 'Reserva Río Blanco', municipio: 'Manizales', categoria: 'Atractivo turístico' },
  { _id: 'f6', nombre: 'Mirador de Neira', municipio: 'Neira', categoria: 'Atractivo turístico' },
  { _id: 'f7', nombre: 'Café Doña Rosa', municipio: 'Chinchiná', categoria: 'Cafetería' },
];

// Hoy devuelve los datos de prueba.
// Después: reemplazar por la llamada real a la API y convertir al formato Favorito.
export async function getFavoritos(): Promise<Favorito[]> {
  return FAVORITOS_DEMO;
}
