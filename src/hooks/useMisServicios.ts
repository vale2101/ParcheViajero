import { useCallback, useMemo, useRef, useState } from 'react';
import { getServiciosByUsuarioId_get, type Servicio } from '../api/servicio';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';

export function useMisServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peticion = useRef(0);

  const recargar = useCallback(async () => {
    const id = ++peticion.current;
    setCargando(true);
    setError(null);

    try {
      const [s, c, m] = await Promise.all([
        getServiciosByUsuarioId_get(),
        getCategorias().catch(() => ({ data: [] as Categoria[] })),
        getMunicipios().catch(() => ({ data: [] as Municipio[] })),
      ]);
      if (id !== peticion.current) return;

      setServicios(s.data);
      setCategorias(c.data);
      setMunicipios(m.data);
      setCargado(true);
    } catch (e) {
      if (id !== peticion.current) return;
      setError((e as Error).message || 'No se pudieron cargar tus servicios');
    } finally {
      if (id === peticion.current) setCargando(false);
    }
  }, []);

  const quitar = useCallback((id: string) => {
    setServicios((prev) => prev.filter((s) => s._id !== id));
  }, []);

  const categoriasPorId = useMemo(
    () => Object.fromEntries(categorias.map((c) => [c._id, c.nombre])) as Record<string, string>,
    [categorias],
  );
  const municipiosPorId = useMemo(
    () => Object.fromEntries(municipios.map((m) => [m._id, m.nombre])) as Record<string, string>,
    [municipios],
  );

  return {
    servicios,
    categorias,
    municipios,
    categoriasPorId,
    municipiosPorId,
    cargando,
    cargado,
    error,
    recargar,
    quitar,
  };
}