import { useCallback, useRef, useState } from 'react';

export function useEliminacionConfirmada<T>() {
  const [objetivo, setObjetivo] = useState<T | null>(null);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enCurso = useRef(false);

  const pedir = useCallback((item: T) => {
    if (enCurso.current) return;
    setError(null);
    setObjetivo(item);
  }, []);

  const cancelar = useCallback(() => {
    if (enCurso.current) return;
    setObjetivo(null);
    setError(null);
  }, []);

  const confirmar = useCallback(
    async (accion: (item: T) => Promise<void>) => {
      if (!objetivo || enCurso.current) return;
      enCurso.current = true;
      setBorrando(true);
      setError(null);
      try {
        await accion(objetivo);
        setObjetivo(null);
      } catch (e) {
        setError((e as Error).message || 'No se pudo completar la eliminación');
      } finally {
        enCurso.current = false;
        setBorrando(false);
      }
    },
    [objetivo],
  );

  return { objetivo, borrando, error, pedir, cancelar, confirmar };
}
