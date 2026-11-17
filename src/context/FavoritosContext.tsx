import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoritosContextValue {
  favoritos: string[]; // ids de los servicios favoritos
  esFavorito: (servicioId: string) => boolean;
  toggleFavorito: (servicioId: string) => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextValue | undefined>(undefined);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState<string[]>([]);

  // Cada usuario guarda sus favoritos con su propia clave
  const clave = user ? `favoritos_${user._id}` : null;

  // Cuando inicia sesión (o cambia de usuario) cargamos sus favoritos guardados
  useEffect(() => {
    if (!clave) {
      setFavoritos([]);
      return;
    }

    AsyncStorage.getItem(clave)
      .then((guardado) => setFavoritos(guardado ? JSON.parse(guardado) : []))
      .catch(() => setFavoritos([]));
  }, [clave]);

  function esFavorito(servicioId: string) {
    return favoritos.includes(servicioId);
  }

  // Si ya es favorito lo quita, si no lo agrega
  async function toggleFavorito(servicioId: string) {
    if (!clave) return;

    const nuevos = favoritos.includes(servicioId)
      ? favoritos.filter((id) => id !== servicioId)
      : [...favoritos, servicioId];

    setFavoritos(nuevos);
    await AsyncStorage.setItem(clave, JSON.stringify(nuevos));
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos(): FavoritosContextValue {
  const ctx = useContext(FavoritosContext);
  if (!ctx) {
    throw new Error('useFavoritos debe usarse dentro de un <FavoritosProvider>');
  }
  return ctx;
}
