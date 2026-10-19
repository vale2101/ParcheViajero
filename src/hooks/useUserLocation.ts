import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useUserLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerUbicacion = useCallback(async (): Promise<UserLocation | null> => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        return null;
      }

      const posicion = await Location.getCurrentPositionAsync({});
      return { lat: posicion.coords.latitude, lng: posicion.coords.longitude };
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { obtenerUbicacion, loading, error };
}