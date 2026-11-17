import { useEffect, useState } from 'react';
import { getServicios, type Servicio } from '../api/servicio';
import { logError } from '../utils/errorApp';

export function useBuscarServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getServicios()
      .then(({ data }) => setServicios(data))
      .catch((e) => {
        logError('No se pudieron cargar los servicios de búsqueda', e);
        setServicios([]);
      });
  }, []);

  const busquedaActiva = query.trim().length > 0;

  const resultados = busquedaActiva
    ? servicios.filter((s) => s.nombre.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  return { query, setQuery, busquedaActiva, resultados };
}