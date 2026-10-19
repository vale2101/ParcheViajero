import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { getResumenAdmin, type ResumenAdmin } from '../api/admin';

interface AdminContextValue {
  resumen: ResumenAdmin | null;
  cargando: boolean;
  error: string | null;
  refrescar: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [resumen, setResumen] = useState<ResumenAdmin | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refrescar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await getResumenAdmin();
      setResumen(data);
    } catch (e) {
      setError((e as Error).message || 'No se pudieron cargar los indicadores');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  return (
    <AdminContext.Provider value={{ resumen, cargando, error, refrescar }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin debe usarse dentro de <AdminProvider>');
  return ctx;
}