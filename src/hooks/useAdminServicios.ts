import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getServiciosAdmin, type EstadoFiltro, type ServicioAdmin } from '../api/admin';

interface Opciones {
  estado: EstadoFiltro;
  q: string;
  categoriaId: string | null;
  municipioId: string | null;
  dias: number | null;
}

export function useAdminServicios({ estado, q, categoriaId, municipioId, dias }: Opciones) {
  const [resultado, setResultado] = useState<{ estado: EstadoFiltro; lista: ServicioAdmin[] } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const peticion = useRef(0);

  const cargar = useCallback(async () => {
    const id = ++peticion.current;
    setCargando(true);
    setError(null);
    try {
      const desde = dias ? new Date(Date.now() - dias * 86400000).toISOString() : null;
      const { data } = await getServiciosAdmin({ estado, q, categoriaId, municipioId, desde });
      if (id !== peticion.current) return;
      setResultado({ estado, lista: data });
    } catch (e) {
      if (id !== peticion.current) return;
      setError((e as Error).message || 'No se pudieron cargar los servicios');
    } finally {
      if (id === peticion.current) setCargando(false);
    }
  }, [estado, q, categoriaId, municipioId, dias]);

  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => void cargar(), q.trim() ? 350 : 0);
      return () => clearTimeout(t);
    }, [cargar, q]),
  );

  const servicios = resultado?.estado === estado ? resultado.lista : [];

  return { servicios, cargando, cargado: resultado !== null, error, recargar: cargar };
}