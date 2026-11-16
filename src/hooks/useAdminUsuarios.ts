import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getUsuariosAdmin, type Orden, type TipoCuenta, type UsuarioAdmin } from '../api/admin';

export function useAdminUsuarios(tipo: TipoCuenta, q: string, orden: Orden) {
  const [resultado, setResultado] = useState<{ tipo: TipoCuenta; lista: UsuarioAdmin[] } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const peticion = useRef(0);

  const cargar = useCallback(async () => {
    const id = ++peticion.current;
    setCargando(true);
    setError(null);
    try {
      const { data } = await getUsuariosAdmin(tipo, q, orden);
      if (id !== peticion.current) return;
      setResultado({ tipo, lista: data });
    } catch (e) {
      if (id !== peticion.current) return;
      setError((e as Error).message || 'No se pudieron cargar los usuarios');
    } finally {
      if (id === peticion.current) setCargando(false);
    }
  }, [tipo, q, orden]);

  useFocusEffect(
    useCallback(() => {
      const t = setTimeout(() => void cargar(), q.trim() ? 350 : 0);
      return () => clearTimeout(t);
    }, [cargar, q]),
  );

  const usuarios = resultado?.tipo === tipo ? resultado.lista : [];

  const quitar = useCallback((id: string) => {
    setResultado((prev) =>
      prev ? { ...prev, lista: prev.lista.filter((u) => u._id !== id) } : prev,
    );
  }, []);

  return { usuarios, cargando, cargado: resultado !== null, error, recargar: cargar, quitar };
}