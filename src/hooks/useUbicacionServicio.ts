import { useCallback, useMemo, useState } from 'react';
import { getMunicipioCoords, type Coords } from '../utils/municipioCoords';
import { evaluarCercania, type Verificacion } from '../utils/verificacionMunicipio';
import type { MapaVista } from '../components/LocationPickerMap.types';

export const ZOOM_MUNICIPIO = 13;
const MIN_DIRECCION = 5;

export interface UbicacionConfirmada {
  direccion: string;
  latitud: number;
  longitud: number;
}

export function useUbicacionServicio() {
  const [municipio, setMunicipio] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [marcador, setMarcador] = useState<Coords | null>(null);
  const [vista, setVista] = useState<MapaVista | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const reiniciar = useCallback((nombreMunicipio: string | null) => {
    setMunicipio(nombreMunicipio);
    setTexto('');
    setMarcador(null);
    setAviso(null);

    if (!nombreMunicipio) {
      setVista(null);
      return;
    }

    const coords = getMunicipioCoords(nombreMunicipio);
    if (coords) {
      setVista((v) => ({ lat: coords.lat, lng: coords.lng, zoom: ZOOM_MUNICIPIO, token: (v?.token ?? 0) + 1 }));
    } else {
      setVista(null);
      setAviso(
        `No tenemos las coordenadas de ${nombreMunicipio} en la aplicación. Busca el lugar en el mapa y coloca el pin.`,
      );
    }
  }, []);

  const moverMarcador = useCallback((lat: number, lng: number) => {
    setMarcador({ lat, lng });
  }, []);

  const verificacion: Verificacion | null = useMemo(
    () => (marcador && municipio ? evaluarCercania(marcador.lat, marcador.lng, municipio) : null),
    [marcador, municipio],
  );

  const direccionValida = texto.trim().length >= MIN_DIRECCION;

  const confirmada: UbicacionConfirmada | null = useMemo(() => {
    if (!marcador || !direccionValida || !verificacion || verificacion.estado === 'fuera') return null;
    return { direccion: texto.trim(), latitud: marcador.lat, longitud: marcador.lng };
  }, [marcador, direccionValida, verificacion, texto]);

  return {
    municipio,
    texto,
    marcador,
    vista,
    aviso,
    verificacion,
    direccionValida,
    confirmada,
    reiniciar,
    editarTexto: setTexto,
    moverMarcador,
  };
}