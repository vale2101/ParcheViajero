import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';
import { buildPinIcon } from '../utils/mapMarkerIcon';
import type { LocationPickerMapProps } from './LocationPickerMap.types';
import { logError } from '../utils/errorApp';

const DEFAULT_LAT = 5.0703;
const DEFAULT_LNG = -75.5138;
const PIN = buildPinIcon('📍', '#0147B9');

export default function LocationPickerMap({
  vista,
  marcador,
  onMarcadorChange,
  interactivo = true,
  height = 300,
}: LocationPickerMapProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const onChangeRef = useRef(onMarcadorChange);
  onChangeRef.current = onMarcadorChange;
  const interactivoRef = useRef(interactivo);
  interactivoRef.current = interactivo;
  const vistaInicial = useRef(vista);

  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsScript()
      .then(() => {
        if (cancelled || !mapDivRef.current) return;

        const google = (window as any).google;
        const v = vistaInicial.current;

        const map = new google.maps.Map(mapDivRef.current, {
          center: { lat: v?.lat ?? DEFAULT_LAT, lng: v?.lng ?? DEFAULT_LNG },
          zoom: v?.zoom ?? 13,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        });

        map.addListener('click', (e: any) => {
          if (!interactivoRef.current) return;
          onChangeRef.current?.(e.latLng.lat(), e.latLng.lng());
        });

        mapRef.current = map;
        setReady(true);
      })
      .catch((e: Error) => {
        logError('No se pudo cargar Google Maps', e);
        if (!cancelled) {
          setLoadError('No hemos podido cargar el mapa. Inténtalo de nuevo.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || !vista) return;
    mapRef.current.panTo({ lat: vista.lat, lng: vista.lng });
    mapRef.current.setZoom(vista.zoom);
  }, [ready, vista]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const google = (window as any).google;

    if (!marcador) {
      markerRef.current?.setMap(null);
      markerRef.current = null;
      return;
    }

    const pos = { lat: marcador.lat, lng: marcador.lng };

    if (!markerRef.current) {
      const marker = new google.maps.Marker({
        position: pos,
        map: mapRef.current,
        draggable: interactivoRef.current,
        title: 'Ubicación del servicio',
        icon: {
          url: PIN,
          scaledSize: new google.maps.Size(36, 46),
          anchor: new google.maps.Point(18, 46),
        },
      });

      marker.addListener('dragend', () => {
        const p = marker.getPosition();
        if (p && interactivoRef.current) onChangeRef.current?.(p.lat(), p.lng());
      });

      markerRef.current = marker;
    } else {
      markerRef.current.setPosition(pos);
    }
  }, [ready, marcador?.lat, marcador?.lng]);

  return (
    <View style={[styles.container, { height }]}>
      {/* @ts-expect-error - ref de DOM, válido en react-native-web */}
      <View ref={mapDivRef} style={styles.map} />
      {!ready && <Text style={styles.loading}>{loadError ?? 'Cargando mapa…'}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: { width: '100%', height: '100%' },
  loading: { position: 'absolute', color: '#6b6b6b', fontSize: 13 },
});