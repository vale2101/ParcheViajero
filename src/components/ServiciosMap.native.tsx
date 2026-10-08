import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { Ref } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import type { Servicio } from '../api/servicio';
import type { Categoria } from '../api/categoria';
import { getCategoriaVisual, DESTACADO_VISUAL } from '../utils/categoriaVisual';
import { buildPinIcon } from '../utils/mapMarkerIcon';
import { PERSONA_PIN_ICON, PERSONA_PIN_SIZE } from '../utils/personaPinIcon';
import { MAP_STYLE } from '../utils/mapStyle';
import { styles } from '../styles/ServiciosMapNative.styles';

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
  iconWidth: number;
  iconHeight: number;
}

function buildHtml(
  markers: MarkerData[],
  userMarker: MarkerData | null,
  centerLat: number,
  centerLng: number,
) {
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
      const userMarkerData = ${JSON.stringify(userMarker)};
      const mapStyle = ${JSON.stringify(MAP_STYLE)};
      let map;

      function addMarker(m) {
        return new google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: map,
          title: m.nombre,
          icon: {
            url: m.icon,
            scaledSize: new google.maps.Size(m.iconWidth, m.iconHeight),
            anchor: new google.maps.Point(m.iconWidth / 2, m.iconHeight),
          },
        });
      }

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: ${centerLat}, lng: ${centerLng} },
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyle,
        });

        markersData.forEach(function (m) {
          const marker = addMarker(m);
          marker.addListener('click', function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ id: m.id }));
          });
        });

        // El pin de "mi ubicación" no es seleccionable, solo informativo
        if (userMarkerData) {
          addMarker(userMarkerData);
        }

        // Expuesto para que RN pueda recentrar el mapa vía injectJavaScript
        // (desde el botón de "mi ubicación" o al elegir un municipio)
        window.centerMap = function (lat, lng, zoom) {
          map.panTo({ lat: lat, lng: lng });
          map.setZoom(zoom || 15);
        };
      }
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
  </body>
</html>`;
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
  }: Props,
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
          iconWidth: 36,
          iconHeight: 46,
        };
      }),
    [servicios, categoriaPorId, destacadoId],
  );

  const userMarker: MarkerData | null = useMemo(() => {
    if (!ubicacionUsuario) return null;
    return {
      id: '__usuario__',
      lat: ubicacionUsuario.lat,
      lng: ubicacionUsuario.lng,
      nombre: 'Tu ubicación',
      icon: PERSONA_PIN_ICON,
      iconWidth: PERSONA_PIN_SIZE.width,
      iconHeight: PERSONA_PIN_SIZE.height,
    };
  }, [ubicacionUsuario]);

  // El HTML solo se reconstruye si cambian los marcadores o el centro inicial,
  // para no reiniciar el mapa (y perder el zoom/posición) en cada render.
  const html = useMemo(
    () => buildHtml(markers, userMarker, centerLat ?? DEFAULT_LAT, centerLng ?? DEFAULT_LNG),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(markers), JSON.stringify(userMarker), centerLat, centerLng],
  );

  useImperativeHandle(ref, () => ({
    centerOn: (lat, lng, zoom) => {
      webviewRef.current?.injectJavaScript(
        `if (window.centerMap) { window.centerMap(${lat}, ${lng}, ${zoom ?? 15}); } true;`,
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
