import { useState } from 'react';

// Lógica de los inputs de latitud y longitud del MapPicker (web y native)
export function useCoordenadas(
  latitud: number | null,
  longitud: number | null,
  onChange: (lat: number, lng: number) => void,
) {
  const [latText, setLatText] = useState(latitud ? String(latitud) : '');
  const [lngText, setLngText] = useState(longitud ? String(longitud) : '');

  // Cuando el usuario toca el mapa o arrastra el pin
  function setDesdeMapa(lat: number, lng: number) {
    setLatText(String(lat));
    setLngText(String(lng));
    onChange(lat, lng);
  }

  // Cuando el usuario escribe las coordenadas a mano.
  // Devuelve las coordenadas o null si no son válidas
  function leerManual() {
    const lat = parseFloat(latText.replace(',', '.'));
    const lng = parseFloat(lngText.replace(',', '.'));

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    onChange(lat, lng);
    return { lat, lng };
  }

  return { latText, lngText, setLatText, setLngText, setDesdeMapa, leerManual };
}
