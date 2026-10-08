import { useState } from 'react';
import { Linking } from 'react-native';
import type { Servicio } from '../api/servicio';

// Abre Google Maps con la ruta desde donde esté la persona hasta el lugar
export function useComoLlegar(servicio: Servicio | null) {
  const [error, setError] = useState<string | null>(null);

  async function abrirRuta() {
    if (!servicio) return;

    const url =
      'https://www.google.com/maps/dir/?api=1' +
      `&destination=${servicio.latitud},${servicio.longitud}&travelmode=driving`;

    try {
      await Linking.openURL(url);
      setError(null);
    } catch {
      setError('No se pudo abrir el mapa');
    }
  }

  return { abrirRuta, error };
}
