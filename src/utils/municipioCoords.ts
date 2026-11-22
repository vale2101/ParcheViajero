export interface Coords {
  lat: number;
  lng: number;
}


const MUNICIPIO_COORDS: Record<string, Coords> = {
  manizales: { lat: 5.0703, lng: -75.5138 },
  villamaría: { lat: 5.0411, lng: -75.5096 },
  neira: { lat: 5.1667, lng: -75.5167 },
  chinchiná: { lat: 4.9803, lng: -75.6064 },
};

export function getMunicipioCoords(nombreMunicipio?: string): Coords | null {
  if (!nombreMunicipio) return null;
  return MUNICIPIO_COORDS[nombreMunicipio.trim().toLowerCase()] ?? null;
}

const RADIO_MUNICIPIO_KM = 35;

function distanciaKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const rad = (grados: number) => (grados * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLng = rad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Nombre en minúsculas del municipio conocido más cercano a esas coordenadas.
export function nombreMunicipioCercano(lat: number, lng: number): string | null {
  let mejor: { nombre: string; km: number } | null = null;

  for (const [nombre, coords] of Object.entries(MUNICIPIO_COORDS)) {
    const km = distanciaKm(lat, lng, coords.lat, coords.lng);
    if (!mejor || km < mejor.km) mejor = { nombre, km };
  }

  if (!mejor || mejor.km > RADIO_MUNICIPIO_KM) return null;
  return mejor.nombre;
}
