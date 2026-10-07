import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getServicios, type Servicio } from '../api/servicio';

export function useServiciosNegocio() {
  const { user } = useAuth();
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const recargar = useCallback(async () => {
    try {
      const { data } = await getServicios();
      setServicios(data.filter((s) => s.usuario_id === user?._id));
    } catch {
    }
  }, [user?._id]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { servicios, recargar };
}