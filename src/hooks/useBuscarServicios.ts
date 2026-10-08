import { useEffect, useState } from 'react';
import { getServicios, type Servicio } from '../api/servicio';

// Busca servicios por nombre (para poder dejarles una reseña)
export function useBuscarServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getServicios()
      .then(({ data }) => setServicios(data))
      .catch(() => setServicios([]));
  }, []);

  const texto = query.trim().toLowerCase();
  const hayBusqueda = texto.length > 0;
  const resultados = hayBusqueda
    ? servicios.filter((s) => s.nombre.toLowerCase().includes(texto))
    : [];

  return { query, setQuery, hayBusqueda, resultados };
}
