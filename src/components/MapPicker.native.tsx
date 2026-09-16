import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import WebView from 'react-native-webview';

interface Props {
  latitud: number | null;
  longitud: number | null;
  onChange: (lat: number, lng: number) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const DEFAULT_LAT = 5.0703;
const DEFAULT_LNG = -75.5138;

function buildHtml(lat: number, lng: number) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      let map;
      let marker;

      function initMap() {
        const center = { lat: ${lat}, lng: ${lng} };
        map = new google.maps.Map(document.getElementById('map'), {
          center,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
        });

        marker = new google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });

        function sendPosition(pos) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ lat: pos.lat(), lng: pos.lng() }));
        }

        map.addListener('click', (e) => {
          marker.setPosition(e.latLng);
          sendPosition(e.latLng);
        });

        marker.addListener('dragend', () => {
          sendPosition(marker.getPosition());
        });
      }

      function moveMarker(lat, lng) {
        const pos = { lat, lng };
        if (marker && map) {
          marker.setPosition(pos);
          map.panTo(pos);
        }
      }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
  </body>
</html>`;
}

export default function MapPicker({ latitud, longitud, onChange }: Props) {
  const webviewRef = useRef<WebView>(null);
  const initialLat = latitud ?? DEFAULT_LAT;
  const initialLng = longitud ?? DEFAULT_LNG;

  const [html] = useState(() => buildHtml(initialLat, initialLng));
  const [latText, setLatText] = useState(latitud ? String(latitud) : '');
  const [lngText, setLngText] = useState(longitud ? String(longitud) : '');

  function handleMessage(event: { nativeEvent: { data: string } }) {
    try {
      const { lat, lng } = JSON.parse(event.nativeEvent.data);
      setLatText(String(lat));
      setLngText(String(lng));
      onChange(lat, lng);
    } catch {
      // ignorar mensajes inválidos
    }
  }

  function applyManualCoords() {
    const lat = parseFloat(latText.replace(',', '.'));
    const lng = parseFloat(lngText.replace(',', '.'));

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    onChange(lat, lng);
    webviewRef.current?.injectJavaScript(`moveMarker(${lat}, ${lng}); true;`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ubicación</Text>

      <View style={styles.mapWrapper}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html }}
          onMessage={handleMessage}
          javaScriptEnabled
          style={styles.map}
        />
      </View>

      <Text style={styles.hint}>Toca el mapa o arrastra el pin, o escribe las coordenadas:</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={latText}
          onChangeText={setLatText}
          onBlur={applyManualCoords}
          onSubmitEditing={applyManualCoords}
          placeholder="Latitud"
          placeholderTextColor="#a3a3a3"
          keyboardType="numbers-and-punctuation"
        />
        <TextInput
          style={styles.input}
          value={lngText}
          onChangeText={setLngText}
          onBlur={applyManualCoords}
          onSubmitEditing={applyManualCoords}
          placeholder="Longitud"
          placeholderTextColor="#a3a3a3"
          keyboardType="numbers-and-punctuation"
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
  },
  map: { flex: 1 },
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