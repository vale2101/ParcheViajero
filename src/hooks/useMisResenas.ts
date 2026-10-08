import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteResena, getResenas, type Resena } from '../api/resena';
import { getServicios, type Servicio } from '../api/servicio';

// Carga las reseñas del usuario y permite borrarlas
export function useMisResenas() {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [servicios, setServicios] = useState<Record<string, Servicio>>({});
  const [loading, setLoading] = useState(true);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: todasResenas }, { data: todosServicios }] = await Promise.all([
        getResenas(),
        getServicios(),
      ]);

      setResenas(todasResenas.filter((r) => r.usuario_id === user._id));
      setServicios(Object.fromEntries(todosServicios.map((s) => [s._id, s])));
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function borrar(id: string) {
    setBorrandoId(id);
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((r) => r._id !== id));
    } catch {
      // si falla, la reseña simplemente se queda en la lista
    } finally {
      setBorrandoId(null);
    }
  }

  return { resenas, servicios, loading, borrandoId, borrar };
}
