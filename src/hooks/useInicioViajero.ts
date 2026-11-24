import { useCallback, useEffect, useState } from 'react';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';
import { getResenas, type Resena } from '../api/resena';
import { getServicios, type Servicio } from '../api/servicio';
import { logError, mensajeErrorUsuario } from '../utils/errorApp';

export function useInicioViajero() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [s, c, m, r] = await Promise.all([
        getServicios(),
        getCategorias(),
        getMunicipios().catch(() => ({ data: [] as Municipio[] })),
        getResenas().catch(() => ({ data: [] as Resena[] })),
      ]);
      const visibles = s.data.filter((item) => item.estado_aprobacion !== 'pendiente' && item.estado_aprobacion !== 'rechazado');
      setServicios(visibles);
      setCategorias(c.data);
      setMunicipios(m.data);
      setResenas(r.data);
    } catch (e) {
      logError('No se pudo cargar el inicio', e);
      setError(mensajeErrorUsuario(e, 'No hemos podido obtener los datos'));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return { servicios, categorias, municipios, resenas, cargando, error, recargar };
}
