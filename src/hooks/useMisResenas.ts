import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteResena, getResenas, updateResena, type Resena } from '../api/resena';
import { getServicios, type Servicio } from '../api/servicio';

export function useMisResenas() {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [servicios, setServicios] = useState<Record<string, Servicio>>({});
  const [loading, setLoading] = useState(true);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [calificacionEdit, setCalificacionEdit] = useState(0);
  const [comentarioEdit, setComentarioEdit] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorEdit, setErrorEdit] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: todasResenas }, { data: todosServicios }] = await Promise.all([
        getResenas(),
        getServicios(),
      ]);

      const mias = todasResenas.filter((r) => r.usuario_id === user._id);
      const mapaServicios = Object.fromEntries(todosServicios.map((s) => [s._id, s]));

      setResenas(mias);
      setServicios(mapaServicios);
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function iniciarEdicion(resena: Resena) {
    setEditandoId(resena._id);
    setCalificacionEdit(resena.calificacion);
    setComentarioEdit(resena.comentario ?? '');
    setErrorEdit(null);
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setErrorEdit(null);
  }

  async function guardarEdicion(id: string) {
    setGuardando(true);
    setErrorEdit(null);
    try {
      await updateResena(id, {
        calificacion: calificacionEdit,
        comentario: comentarioEdit.trim() || undefined,
      });
      setResenas((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, calificacion: calificacionEdit, comentario: comentarioEdit.trim() || undefined }
            : r,
        ),
      );
      setEditandoId(null);
    } catch (err) {
      setErrorEdit((err as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarResena(id: string) {
    setBorrandoId(id);
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((r) => r._id !== id));
    } catch {
    } finally {
      setBorrandoId(null);
    }
  }

  return {
    resenas,
    servicios,
    loading,
    borrandoId,
    editandoId,
    calificacionEdit,
    setCalificacionEdit,
    comentarioEdit,
    setComentarioEdit,
    guardando,
    errorEdit,
    setErrorEdit,
    iniciarEdicion,
    cancelarEdicion,
    guardarEdicion,
    eliminarResena,
  };
}