import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Servicio } from '../api/servicio';
import { formatearDistanciaKm } from '../utils/municipioCoords';
import { colors } from '../styles/theme';
import { styles } from '../styles/UsuarioInicio.styles';
import Foto from './Foto';
import FotoPlaceholder from './FotoPlaceholder';

interface Props {
  servicios: Servicio[];
  categoriaDe: (s: Servicio) => string | undefined;
  distanciaDe: (s: Servicio) => number | undefined;
  onAbrir: (s: Servicio) => void;
}

export default function RutaCercanos({ servicios, categoriaDe, distanciaDe, onAbrir }: Props) {
  const paradas = servicios.slice(0, 5);

  return (
    <View style={styles.rutaCaja}>
      {paradas.map((s, i) => {
        const foto = s.imagenes?.[0]?.url_imagen;
        const cat = categoriaDe(s);
        const km = distanciaDe(s);
        const ultima = i === paradas.length - 1;

        return (
          <View key={s._id} style={styles.rutaFila}>
            <View style={styles.rutaEje}>
              <View style={styles.rutaPunto}>
                <Text style={styles.rutaNumero}>{i + 1}</Text>
              </View>
              {!ultima && <View style={styles.rutaLinea} />}
            </View>

            <Pressable
              onPress={() => onAbrir(s)}
              style={styles.rutaTarjeta}
              accessibilityRole="button"
              accessibilityLabel={`${s.nombre}, ${km !== undefined ? formatearDistanciaKm(km) : ''}`}>
              <View style={styles.rutaFoto}>
                {foto ? (
                  <Foto uri={foto} recyclingKey={s._id} style={styles.rutaFotoImg} />
                ) : (
                  <FotoPlaceholder plano categoria={cat} style={styles.rutaFotoImg} />
                )}
              </View>
              <View style={styles.rutaTexto}>
                <Text style={styles.rutaNombre} numberOfLines={1}>
                  {s.nombre}
                </Text>
                {!!cat && (
                  <Text style={styles.rutaCat} numberOfLines={1}>
                    {cat}
                  </Text>
                )}
              </View>
              <View style={styles.rutaDist}>
                <Ionicons name="navigate" size={14} color={colors.azul} />
                <Text style={styles.rutaKm}>
                  {km !== undefined ? formatearDistanciaKm(km) : '—'}
                </Text>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
