import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { buildPinIcon } from '../utils/mapMarkerIcon';
import type { LocationPickerMapProps } from './LocationPickerMap.types';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const DEFAULT_LAT = 5.0703;
const DEFAULT_LNG = -75.5138;

function buildHtml(lat: number, lng: number, zoom: number, interactivo: boolean) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
    <script>
      var map, marker;
      var pending = { view: null, marker: undefined };
      var PIN = ${JSON.stringify(buildPinIcon('📍', '#0147B9'))};
      var INTERACTIVE = ${interactivo};

      function post(lat, lng) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
      }

      window.applyView = function (v) {
        if (!map) { pending.view = v; return; }
        if (v) { map.panTo({ lat: v.lat, lng: v.lng }); map.setZoom(v.zoom); }
      };

      window.applyMarker = function (m) {
        if (!map) { pending.marker = m; return; }
        if (!m) { if (marker) { marker.setMap(null); marker = null; } return; }
        var pos = { lat: m.lat, lng: m.lng };
        if (!marker) {
          marker = new google.maps.Marker({
            position: pos,
            map: map,
            draggable: INTERACTIVE,
            icon: {
              url: PIN,
              scaledSize: new google.maps.Size(36, 46),
              anchor: new google.maps.Point(18, 46)
            }
          });
          marker.addListener('dragend', function () {
            var p = marker.getPosition();
            if (INTERACTIVE) post(p.lat(), p.lng());
          });
        } else {
          marker.setPosition(pos);
        }
      };

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: ${lat}, lng: ${lng} },
          zoom: ${zoom},
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false
        });
        map.addListener('click', function (e) {
          if (INTERACTIVE) post(e.latLng.lat(), e.latLng.lng());
        });
        if (pending.view) window.applyView(pending.view);
        if (pending.marker !== undefined) window.applyMarker(pending.marker);
      }
    </script>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
  </body>
</html>`;
}

export default function LocationPickerMap({
  vista,
  marcador,
  onMarcadorChange,
  interactivo = true,
  height = 300,
}: LocationPickerMapProps) {
  const webviewRef = useRef<WebView>(null);
  const vistaRef = useRef(vista);
  const marcadorRef = useRef(marcador);
  vistaRef.current = vista;
  marcadorRef.current = marcador;

  const [html] = useState(() =>
    buildHtml(vista?.lat ?? DEFAULT_LAT, vista?.lng ?? DEFAULT_LNG, vista?.zoom ?? 13, interactivo),
  );

  function inyectarVista() {
    webviewRef.current?.injectJavaScript(
      `window.applyView && window.applyView(${JSON.stringify(vistaRef.current)}); true;`,
    );
  }

  function inyectarMarcador() {
    webviewRef.current?.injectJavaScript(
      `window.applyMarker && window.applyMarker(${JSON.stringify(marcadorRef.current)}); true;`,
    );
  }

  useEffect(() => {
    inyectarVista();
  }, [vista]);

  useEffect(() => {
    inyectarMarcador();
  }, [marcador?.lat, marcador?.lng]);

  function handleMessage(event: { nativeEvent: { data: string } }) {
    try {
      const { lat, lng } = JSON.parse(event.nativeEvent.data) as { lat: number; lng: number };
      onMarcadorChange?.(lat, lng);
    } catch {
    }
  }

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        onLoadEnd={() => {
          inyectarVista();
          inyectarMarcador();
        }}
        javaScriptEnabled
        scrollEnabled={false}
        nestedScrollEnabled
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    overflow: 'hidden',
  },
  map: { flex: 1 },
});