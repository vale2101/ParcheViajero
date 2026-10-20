import { getMunicipioCoords } from './municipioCoords';

export type EstadoVerificacion = 'dentro' | 'aproximada' | 'fuera';

export interface Verificacion {
  estado: EstadoVerificacion;
  detalle: string;
}

// Más allá de este radio desde el centro del municipio se bloquea el pin
const RADIO_MAXIMO_KM = 20;

function distanciaKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function evaluarCercania(lat: number, lng: number, municipio: string): Verificacion {
  const centro = getMunicipioCoords(municipio);

  if (!centro) {
    return {
      estado: 'aproximada',
      detalle: 'No se pudo verificar que el punto esté en el municipio. Revisa el mapa.',
    };
  }

  const km = distanciaKm(lat, lng, centro.lat, centro.lng);

  if (km > RADIO_MAXIMO_KM) {
    return {
      estado: 'fuera',
      detalle: `El pin está a ${km.toFixed(1)} km del centro de ${municipio}. Muévelo dentro del municipio.`,
    };
  }

  return {
    estado: 'dentro',
    detalle: `El pin está a ${km.toFixed(1)} km del centro de ${municipio}. No se verifica el límite exacto del municipio.`,
  };
}