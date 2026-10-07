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
