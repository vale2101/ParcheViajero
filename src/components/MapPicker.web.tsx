import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  latitud: number | null;
  longitud: number | null;
  onChange: (lat: number, lng: number) => void;
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

export default function MapPicker({ latitud, longitud, onChange }: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const initialLat = latitud ?? DEFAULT_LAT;
  const initialLng = longitud ?? DEFAULT_LNG;

  const [latText, setLatText] = useState(latitud ? String(latitud) : '');
  const [lngText, setLngText] = useState(longitud ? String(longitud) : '');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsScript().then(() => {
      if (cancelled || !mapDivRef.current) return;

      const google = (window as any).google;
      const center = { lat: initialLat, lng: initialLng };

      const map = new google.maps.Map(mapDivRef.current, {
        center,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
      });

      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });

      function updatePosition(pos: any) {
        const lat = pos.lat();
        const lng = pos.lng();
        setLatText(String(lat));
        setLngText(String(lng));
        onChange(lat, lng);
      }

      map.addListener('click', (e: any) => {
        marker.setPosition(e.latLng);
        updatePosition(e.latLng);
      });

      marker.addListener('dragend', () => {
        updatePosition(marker.getPosition());
      });

      mapRef.current = map;
      markerRef.current = marker;
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
    // Solo se inicializa una vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyManualCoords() {
    const lat = parseFloat(latText.replace(',', '.'));
    const lng = parseFloat(lngText.replace(',', '.'));

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    onChange(lat, lng);

    if (mapRef.current && markerRef.current) {
      const pos = { lat, lng };
      markerRef.current.setPosition(pos);
      mapRef.current.panTo(pos);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ubicación</Text>

      <View style={styles.mapWrapper}>
        {/* @ts-expect-error - ref de DOM, válido en react-native-web */}
        <View ref={mapDivRef} style={styles.map} />
        {!ready && <Text style={styles.loadingText}>Cargando mapa…</Text>}
      </View>

      <Text style={styles.hint}>Haz clic en el mapa o arrastra el pin, o escribe las coordenadas:</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={latText}
          onChangeText={setLatText}
          onBlur={applyManualCoords}
          onSubmitEditing={applyManualCoords}
          placeholder="Latitud"
          placeholderTextColor="#a3a3a3"
        />
        <TextInput
          style={styles.input}
          value={lngText}
          onChangeText={setLngText}
          onBlur={applyManualCoords}
          onSubmitEditing={applyManualCoords}
          placeholder="Longitud"
          placeholderTextColor="#a3a3a3"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#0147B9' },
  mapWrapper: {
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: { width: '100%', height: '100%' },
  loadingText: { position: 'absolute', color: '#a3a3a3', fontSize: 13 },
  hint: { fontSize: 12, color: '#a3a3a3' },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FAF4E4',
    padding: 12,
    fontSize: 14,
    color: '#171717',
  },
});