import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { Text, View } from 'react-native';
import type { Servicio } from '../api/servicio';
import type { Categoria } from '../api/categoria';
import { getCategoriaVisual, DESTACADO_VISUAL } from '../utils/categoriaVisual';
import { buildPinIcon } from '../utils/mapMarkerIcon';
import { PERSONA_PIN_ICON, PERSONA_PIN_SIZE } from '../utils/personaPinIcon';
import { MAP_STYLE } from '../utils/mapStyle';
import { styles } from '../styles/ServiciosMapWeb.styles';

export interface ServiciosMapHandle {
  centerOn: (lat: number, lng: number, zoom?: number) => void;
}

interface Props {
  servicios: Servicio[];
  categorias: Categoria[];
  destacadoId?: string | null;
  onSelectServicio: (servicio: Servicio) => void;
  ubicacionUsuario?: { lat: number; lng: number } | null;
  centerLat?: number;
  centerLng?: number;
  ajustarVista?: boolean;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const DEFAULT_LAT = 5.0703;
const DEFAULT_LNG = -75.5138;

let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if ((window as any).google?.maps) return Promise.resolve();

  if (!scriptLoadingPromise) {
    scriptLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Google Maps'));
      document.head.appendChild(script);
    });
  }

  return scriptLoadingPromise;
}

function ServiciosMap(
  {
    servicios,
    categorias,
    destacadoId,
    onSelectServicio,
    ubicacionUsuario,
    centerLat,
    centerLng,
    ajustarVista,

    
  }: Props,
  ref: Ref<ServiciosMapHandle>,
) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const onSelectRef = useRef(onSelectServicio);
  onSelectRef.current = onSelectServicio;

  const [ready, setReady] = useState(false);

  const categoriaPorId = useMemo(
    () => Object.fromEntries(categorias.map((c) => [c._id, c.nombre])),
    [categorias],
  );


  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsScript().then(() => {
      if (cancelled || !mapDivRef.current) return;

      const google = (window as any).google;
      const center = { lat: centerLat ?? DEFAULT_LAT, lng: centerLng ?? DEFAULT_LNG };

      mapRef.current = new google.maps.Map(mapDivRef.current, {
        center,
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        styles: MAP_STYLE,
      });

      setReady(true);
    });

    return () => {
      cancelled = true;
    };

  }, []);


  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const google = (window as any).google;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    servicios.forEach((servicio) => {
      const visual =
        servicio._id === destacadoId
          ? DESTACADO_VISUAL
          : getCategoriaVisual(categoriaPorId[servicio.categoria_id]);

      const marker = new google.maps.Marker({
        position: { lat: servicio.latitud, lng: servicio.longitud },
        map: mapRef.current,
        title: servicio.nombre,
        icon: {
          url: buildPinIcon(visual.emoji, visual.color),
          scaledSize: new google.maps.Size(36, 46),
          anchor: new google.maps.Point(18, 46),
        },
      });

      marker.addListener('click', () => onSelectRef.current(servicio));
      markersRef.current.push(marker);
    });
  }, [ready, servicios, categoriaPorId, destacadoId, ajustarVista]);
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const google = (window as any).google;

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }

    if (ubicacionUsuario) {
      userMarkerRef.current = new google.maps.Marker({
        position: { lat: ubicacionUsuario.lat, lng: ubicacionUsuario.lng },
        map: mapRef.current,
        title: 'Tu ubicación',
        icon: {
          url: PERSONA_PIN_ICON,
          scaledSize: new google.maps.Size(PERSONA_PIN_SIZE.width, PERSONA_PIN_SIZE.height),
          anchor: new google.maps.Point(PERSONA_PIN_SIZE.width / 2, PERSONA_PIN_SIZE.height),
        },
      });
    }
  }, [ready, ubicacionUsuario]);

  useImperativeHandle(ref, () => ({
    centerOn: (lat, lng, zoom) => {
      if (!mapRef.current) return;
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(zoom ?? 15);
    },
  }));

  return (
    <View style={styles.container}>
      {/* @ts-expect-error - ref de DOM, válido en react-native-web */}
      <View ref={mapDivRef} style={styles.map} />
      {!ready && <Text style={styles.loadingText}>Cargando mapa…</Text>}
    </View>
  );
}

export default forwardRef(ServiciosMap);
