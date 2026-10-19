import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createResena, updateResena, getResenasByServicio, type Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';

export function useServicioResenas(servicio: Servicio | null, visible: boolean) {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [miResena, setMiResena] = useState<Resena | null>(null);

  const cargarResenas = useCallback(async () => {
    if (!servicio) return;
    setLoading(true);
    try {
      const { data } = await getResenasByServicio(servicio._id);
      setResenas(data);

      const propia = data.find((r) => r.usuario_id === user?._id) ?? null;
      setMiResena(propia);
      setCalificacion(propia?.calificacion ?? 0);
      setComentario(propia?.comentario ?? '');
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [servicio, user?._id]);

  useEffect(() => {
    if (visible) {
      setError(null);
      cargarResenas();
    }
  }, [visible, cargarResenas]);

  async function enviar() {
    if (!servicio || !user) return;

    setError(null);
    setSubmitting(true);

    try {
      if (miResena) {
        await updateResena(miResena._id, {
          calificacion,
          comentario: comentario.trim() || undefined,
        });
      } else {
        await createResena({
          usuario_id: user._id,
          servicio_id: servicio._id,
          calificacion,
          comentario: comentario.trim() || undefined,
        });
      }

      await cargarResenas();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return {
    usuarioId: user?._id,
    resenas,
    loading,
    calificacion,
    setCalificacion,
    comentario,
    setComentario,
    error,
    setError,
    submitting,
    miResena,
    enviar,
  };
}