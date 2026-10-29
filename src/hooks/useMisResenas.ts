import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteResena, getResenas, updateResena, type Resena } from '../api/resena';
import { getServicios, type Servicio } from '../api/servicio';
import { logError } from '../utils/errorApp';
import { useAlert } from '../context/AlertContext';
import { idUsuarioResena } from '../utils/resenaAutor';

export function useMisResenas() {
  const { user } = useAuth();
  const { confirmar, errorVital } = useAlert();
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

      const mias = todasResenas.filter((r) => idUsuarioResena(r) === user._id);
      const mapaServicios = Object.fromEntries(todosServicios.map((s) => [s._id, s]));

      setResenas(mias);
      setServicios(mapaServicios);
    } catch (err) {
      logError('No se pudieron cargar tus reseñas', err);
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
      setErrorEdit(
        errorVital(
          'No se pudo actualizar la reseña',
          err,
          'Error en la base de datos. Inténtalo más tarde.',
          'No se pudo guardar',
        ),
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarResena(id: string) {
    const ok = await confirmar({
      titulo: 'Eliminar reseña',
      mensaje: '¿Seguro que quieres eliminar esta reseña? Esta acción no se puede deshacer.',
      confirmarTexto: 'Eliminar',
    });
    if (!ok) return;

    setBorrandoId(id);
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      errorVital(
        'No se pudo eliminar la reseña',
        err,
        'Error en la base de datos. Inténtalo más tarde.',
        'No se pudo eliminar',
      );
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