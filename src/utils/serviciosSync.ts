type Listener = () => void;

const listeners = new Set<Listener>();

export function notificarServiciosCambiados() {
  listeners.forEach((listener) => listener());
}

export function suscribirServiciosCambiados(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
