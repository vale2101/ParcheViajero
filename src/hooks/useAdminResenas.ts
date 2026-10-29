import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getResenasAdmin, type ResenaAdmin } from '../api/admin';

export function useAdminResenas(q: string, calificacion: number | null) {
  const [resenas, setResenas] = useState<ResenaAdmin[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peticion = useRef(0);

  const cargar = useCallback(async () => {
    const id = ++peticion.current;
    setCargando(true);
    setError(null);
    try {
      const { data } = await getResenasAdmin(q, calificacion);
      if (id !== peticion.current) return;
      setResenas(data);
      setCargado(true);
    } catch (e) {
      if (id !== peticion.current) return;
      setError((e as Error).message || 'No se pudieron cargar las reseñas');
    } finally {
      if (id === peticion.current) setCargando(false);
    }
  }, [q, calificacion]);

  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => void cargar(), q.trim() ? 350 : 0);
      return () => clearTimeout(t);
    }, [cargar, q]),
  );

  const quitar = useCallback((id: string) => {
    setResenas((prev) => prev.filter((r) => r._id !== id));
  }, []);

  return { resenas, cargando, cargado, error, recargar: cargar, quitar };
}