import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createResena, deleteResena, getResenasByServicio, type Resena } from '../api/resena';
import type { Servicio } from '../api/servicio';
import { ordenarResenas, type OrdenResenas } from '../utils/resenas';
import { useNombresUsuarios } from './useNombresUsuarios';

// Lista las reseñas de un servicio, las ordena y maneja el formulario para publicar
export function useResenasServicio(visible: boolean, servicio: Servicio | null) {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(false);
  const [orden, setOrden] = useState<OrdenResenas>('recientes');
  const [formVisible, setFormVisible] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  const nombres = useNombresUsuarios(resenas);
  const ordenadas = useMemo(() => ordenarResenas(resenas, orden), [resenas, orden]);

  const cargarResenas = useCallback(async () => {
    if (!servicio) return;
    setLoading(true);
    try {
      const { data } = await getResenasByServicio(servicio._id);
      setResenas(data);
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [servicio]);

  useEffect(() => {
    if (visible) {
      cargarResenas();
      setOrden('recientes');
      setFormVisible(false);
      setCalificacion(0);
      setComentario('');
      setError(null);
    }
  }, [visible, cargarResenas]);

  async function publicar() {
    if (!servicio || !user) return;

    if (calificacion < 1) {
      setError('Selecciona una calificación de 1 a 5 estrellas');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await createResena({
        usuario_id: user._id,
        servicio_id: servicio._id,
        calificacion,
        comentario: comentario.trim() || undefined,
      });

      setCalificacion(0);
      setComentario('');
      setFormVisible(false);
      await cargarResenas();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function borrar(id: string) {
    setBorrandoId(id);
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((r) => r._id !== id));
    } catch {
      // si falla, la reseña se queda en la lista
    } finally {
      setBorrandoId(null);
    }
  }

  return {
    usuarioId: user?._id,
    resenas,
    ordenadas,
    nombres,
    loading,
    orden,
    setOrden,
    formVisible,
    toggleForm: () => setFormVisible((v) => !v),
    calificacion,
    setCalificacion,
    comentario,
    setComentario,
    error,
    submitting,
    publicar,
    borrar,
    borrandoId,
  };
}
