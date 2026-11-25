import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { logError } from '../utils/errorApp';

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

      const reciente = await Location.getLastKnownPositionAsync();
      if (reciente && Date.now() - reciente.timestamp < 5 * 60 * 1000) {
        return {
          lat: reciente.coords.latitude,
          lng: reciente.coords.longitude,
        };
      }

      const posicion = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return { lat: posicion.coords.latitude, lng: posicion.coords.longitude };
    } catch (err) {
      logError('No se pudo obtener la ubicación', err);
      setError('No hemos podido obtener tu ubicación. Inténtalo de nuevo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { obtenerUbicacion, loading, error };
}