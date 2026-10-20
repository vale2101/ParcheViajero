export interface MapaVista {
  lat: number;
  lng: number;
  zoom: number;
  token: number;
}

export interface MapaMarcador {
  lat: number;
  lng: number;
}

export interface LocationPickerMapProps {
  vista: MapaVista | null;
  marcador: MapaMarcador | null;
  onMarcadorChange?: (lat: number, lng: number) => void;
  interactivo?: boolean;
  height?: number;
}