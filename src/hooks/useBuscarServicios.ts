import { useEffect, useState } from 'react';
import { getServicios, type Servicio } from '../api/servicio';

export function useBuscarServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getServicios()
      .then(({ data }) => setServicios(data))
      .catch(() => setServicios([]));
  }, []);

  const busquedaActiva = query.trim().length > 0;

  const resultados = busquedaActiva
    ? servicios.filter((s) => s.nombre.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return { query, setQuery, busquedaActiva, resultados };
}