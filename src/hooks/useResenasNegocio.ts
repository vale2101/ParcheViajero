import { useEffect, useMemo, useState } from 'react';
import { getResenasByServicio, type Resena } from '../api/resena';
import { ordenarResenas } from '../utils/resenas';
import { useNombresUsuarios } from './useNombresUsuarios';
import { useServiciosNegocio } from './useServiciosNegocio';

export type FiltroNegocio = 'todas' | 'recientes' | 'bajas';

// Reseñas que le dejaron al negocio, por cada uno de sus lugares
export function useResenasNegocio() {
  const { servicios } = useServiciosNegocio();
  const [servicioId, setServicioId] = useState<string | null>(null);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [filtro, setFiltro] = useState<FiltroNegocio>('todas');
  const [loading, setLoading] = useState(false);

  const nombres = useNombresUsuarios(resenas);

  // Si no hay lugar escogido, se escoge el primero
  useEffect(() => {
    if (!servicioId && servicios.length > 0) {
      setServicioId(servicios[0]._id);
    }
  }, [servicios, servicioId]);

  // Cada vez que cambia el lugar, se cargan sus reseñas
  useEffect(() => {
    if (!servicioId) return;

    setLoading(true);
    getResenasByServicio(servicioId)
      .then(({ data }) => setResenas(data))
      .catch(() => setResenas([]))
      .finally(() => setLoading(false));
  }, [servicioId]);

  const bajasCount = resenas.filter((r) => r.calificacion <= 3).length;

  const visibles = useMemo(() => {
    if (filtro === 'recientes') return ordenarResenas(resenas, 'recientes');
    if (filtro === 'bajas') {
      return ordenarResenas(
        resenas.filter((r) => r.calificacion <= 3),
        'recientes',
      );
    }
    return resenas;
  }, [resenas, filtro]);

  return {
    servicios,
    servicioId,
    setServicioId,
    resenas,
    visibles,
    nombres,
    filtro,
    setFiltro,
    bajasCount,
    loading,
  };
}
