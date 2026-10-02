import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { Ref } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import type { Servicio } from '../api/servicio';
import type { Categoria } from '../api/categoria';
import { getCategoriaVisual, DESTACADO_VISUAL } from '../utils/categoriaVisual';
import { buildPinIcon } from '../utils/mapMarkerIcon';
import { MAP_STYLE } from '../utils/mapStyle';

export interface ServiciosMapHandle {
  centerOn: (lat: number, lng: number) => void;
}

interface Props {
  servicios: Servicio[];
  categorias: Categoria[];
  destacadoId?: string | null;
  onSelectServicio: (servicio: Servicio) => void;
  centerLat?: number;
  centerLng?: number;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

const DEFAULT_LAT = 5.0703;
const DEFAULT_LNG = -75.5138;

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  nombre: string;
  icon: string;
}

function buildHtml(markers: MarkerData[], centerLat: number, centerLng: number) {
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
      const markersData = ${JSON.stringify(markers)};
      const mapStyle = ${JSON.stringify(MAP_STYLE)};
      let map;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: ${centerLat}, lng: ${centerLng} },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyle,
        });

        markersData.forEach(function (m) {
          const marker = new google.maps.Marker({
            position: { lat: m.lat, lng: m.lng },
            map: map,
            title: m.nombre,
            icon: {
              url: m.icon,
              scaledSize: new google.maps.Size(36, 46),
              anchor: new google.maps.Point(18, 46),
            },
          });

          marker.addListener('click', function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ id: m.id }));
          });
        });

        // Expuesto para que RN pueda recentrar el mapa vía injectJavaScript
        // (por ejemplo, desde el botón de "mi ubicación")
        window.centerMap = function (lat, lng) {
          map.panTo({ lat: lat, lng: lng });
          map.setZoom(15);
        };
      }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
  </body>
</html>`;
}

function ServiciosMap(
  { servicios, categorias, destacadoId, onSelectServicio, centerLat, centerLng }: Props,
  ref: Ref<ServiciosMapHandle>,
) {
  const webviewRef = useRef<WebView>(null);

  const categoriaPorId = useMemo(
    () => Object.fromEntries(categorias.map((c) => [c._id, c.nombre])),
    [categorias],
  );

  const markers: MarkerData[] = useMemo(
    () =>
      servicios.map((s) => {
        const visual =
          s._id === destacadoId
            ? DESTACADO_VISUAL
            : getCategoriaVisual(categoriaPorId[s.categoria_id]);

        return {
          id: s._id,
          lat: s.latitud,
          lng: s.longitud,
          nombre: s.nombre,
          icon: buildPinIcon(visual.emoji, visual.color),
        };
      }),
    [servicios, categoriaPorId, destacadoId],
  );

  // El HTML solo se reconstruye si cambian los marcadores o el centro inicial,
  // para no reiniciar el mapa (y perder el zoom/posición) en cada render.
  const html = useMemo(
    () => buildHtml(markers, centerLat ?? DEFAULT_LAT, centerLng ?? DEFAULT_LNG),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(markers), centerLat, centerLng],
  );

  useImperativeHandle(ref, () => ({
    centerOn: (lat, lng) => {
      webviewRef.current?.injectJavaScript(
        `if (window.centerMap) { window.centerMap(${lat}, ${lng}); } true;`,
      );
    },
  }));

  function handleMessage(event: { nativeEvent: { data: string } }) {
    try {
      const { id } = JSON.parse(event.nativeEvent.data) as { id: string };
      const servicio = servicios.find((s) => s._id === id);
      if (servicio) onSelectServicio(servicio);
    } catch {
      // ignorar mensajes inválidos
    }
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        style={styles.map}
      />
    </View>
  );
}

export default forwardRef(ServiciosMap);

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
