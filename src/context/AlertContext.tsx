import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AppAlert, { type TipoAlerta } from '../components/AppAlert';
import { logError, mensajeErrorUsuario } from '../utils/errorApp';

export interface OpcionesConfirmacion {
  titulo: string;
  mensaje: string;
  confirmarTexto?: string;
  cancelarTexto?: string;
  tono?: 'peligro' | 'exito';
}

interface AlertContextValue {
  mostrarError: (mensaje: string, titulo?: string) => void;
  mostrarExito: (mensaje: string, titulo?: string) => void;
  confirmar: (opciones: OpcionesConfirmacion) => Promise<boolean>;
  errorVital: (contexto: string, err: unknown, fallback: string, titulo?: string) => string;
}

interface EstadoAlerta {
  visible: boolean;
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  confirmarTexto: string;
  cancelarTexto: string;
  tono: 'peligro' | 'exito';
}

const INICIAL: EstadoAlerta = {
  visible: false,
  tipo: 'error',
  titulo: '',
  mensaje: '',
  confirmarTexto: 'Confirmar',
  cancelarTexto: 'Cancelar',
  tono: 'peligro',
};

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAlerta>(INICIAL);
  const resolverRef = useRef<((valor: boolean) => void) | null>(null);

  const cerrarPendiente = useCallback((valor: boolean) => {
    resolverRef.current?.(valor);
    resolverRef.current = null;
  }, []);

  const mostrarError = useCallback((mensaje: string, titulo = 'No se pudo completar') => {
    cerrarPendiente(false);
    setEstado({
      ...INICIAL,
      visible: true,
      tipo: 'error',
      titulo,
      mensaje,
    });
  }, [cerrarPendiente]);

  const mostrarExito = useCallback((mensaje: string, titulo = 'Listo') => {
    cerrarPendiente(false);
    setEstado({
      ...INICIAL,
      visible: true,
      tipo: 'exito',
      titulo,
      mensaje,
    });
  }, [cerrarPendiente]);

  const confirmar = useCallback((opciones: OpcionesConfirmacion) => {
    cerrarPendiente(false);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setEstado({
        visible: true,
        tipo: 'confirm',
        titulo: opciones.titulo,
        mensaje: opciones.mensaje,
        confirmarTexto: opciones.confirmarTexto ?? 'Confirmar',
        cancelarTexto: opciones.cancelarTexto ?? 'Cancelar',
        tono: opciones.tono ?? 'peligro',
      });
    });
  }, [cerrarPendiente]);

  const errorVital = useCallback(
    (contexto: string, err: unknown, fallback: string, titulo?: string) => {
      logError(contexto, err);
      const mensaje = mensajeErrorUsuario(err, fallback);
      mostrarError(mensaje, titulo);
      return mensaje;
    },
    [mostrarError],
  );

  function onClose() {
    const eraConfirm = estado.tipo === 'confirm';
    setEstado((prev) => ({ ...prev, visible: false }));
    if (eraConfirm) cerrarPendiente(false);
  }

  function onConfirm() {
    setEstado((prev) => ({ ...prev, visible: false }));
    cerrarPendiente(true);
  }

  return (
    <AlertContext.Provider value={{ mostrarError, mostrarExito, confirmar, errorVital }}>
      {children}
      <AppAlert
        visible={estado.visible}
        tipo={estado.tipo}
        titulo={estado.titulo}
        mensaje={estado.mensaje}
        confirmarTexto={estado.confirmarTexto}
        cancelarTexto={estado.cancelarTexto}
        tono={estado.tono}
        cargando={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert debe usarse dentro de <AlertProvider>');
  return ctx;
}
