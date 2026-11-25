import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import type { Servicio } from '../api/servicio';
import { styles } from '../styles/UsuarioInicio.styles';
import CategoriaSticker from './CategoriaSticker';
import Foto from './Foto';
import FotoPlaceholder from './FotoPlaceholder';
import MarcoPolaroid from './MarcoPolaroid';
import StarRating from './StarRating';

interface Props {
  servicios: Servicio[];
  categoriaDe: (s: Servicio) => string | undefined;
  promedioDe: (id: string) => number | undefined;
  cantidadDe: (id: string) => number | undefined;
  onAbrir: (s: Servicio) => void;
}

export default function DestacadoCalificados({
  servicios,
  categoriaDe,
  promedioDe,
  cantidadDe,
  onAbrir,
}: Props) {
  const { width } = useWindowDimensions();
  const estrella = servicios[0];
  const otros = servicios.slice(1, 3);
  if (!estrella) return null;

  const anchoFoto = Math.min(280, Math.max(200, width - 96));
  const altoFoto = Math.round(anchoFoto * 0.62);
  const foto = estrella.imagenes?.[0]?.url_imagen;
  const categoria = categoriaDe(estrella);
  const promedio = promedioDe(estrella._id);
  const cantidad = cantidadDe(estrella._id) ?? 0;

  return (
    <View style={styles.destacadoCaja}>
      <Pressable
        onPress={() => onAbrir(estrella)}
        accessibilityRole="button"
        accessibilityLabel={`Parche estrella: ${estrella.nombre}`}
        style={styles.destacadoHero}>
        <MarcoPolaroid ancho={anchoFoto} alto={altoFoto} rotacion="-3deg">
          {foto ? (
            <Foto uri={foto} recyclingKey={estrella._id} style={{ width: anchoFoto, height: altoFoto }} />
          ) : (
            <FotoPlaceholder plano categoria={categoria} style={{ width: anchoFoto, height: altoFoto }} />
          )}
        </MarcoPolaroid>
        <View style={styles.selloEstrella}>
          <Text style={styles.selloTexto}>Parche estrella</Text>
        </View>
      </Pressable>

      <Pressable onPress={() => onAbrir(estrella)} style={styles.destacadoInfo}>
        <Text style={styles.destacadoNombre} numberOfLines={2}>
          {estrella.nombre}
        </Text>
        <CategoriaSticker nombre={categoria} />
        <View style={styles.destacadoNotas}>
          {promedio !== undefined && <StarRating value={Math.round(promedio)} readonly size={16} />}
          <Text style={styles.destacadoResenas}>
            {promedio?.toFixed(1) ?? '—'} · {cantidad} {cantidad === 1 ? 'reseña' : 'reseñas'}
          </Text>
        </View>
      </Pressable>

      {otros.length > 0 && (
        <View style={styles.destacadoFila}>
          {otros.map((s, i) => {
            const mini = s.imagenes?.[0]?.url_imagen;
            const cat = categoriaDe(s);
            return (
              <Pressable
                key={s._id}
                onPress={() => onAbrir(s)}
                style={styles.destacadoMini}
                accessibilityRole="button"
                accessibilityLabel={s.nombre}>
                <View style={styles.destacadoMiniFoto}>
                  {mini ? (
                    <Foto uri={mini} recyclingKey={s._id} style={styles.destacadoMiniImg} />
                  ) : (
                    <FotoPlaceholder plano categoria={cat} style={styles.destacadoMiniImg} />
                  )}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.puesto}>#{i + 2}</Text>
                  <Text style={styles.destacadoMiniNombre} numberOfLines={2}>
                    {s.nombre}
                  </Text>
                  {promedioDe(s._id) !== undefined && (
                    <StarRating value={Math.round(promedioDe(s._id)!)} readonly size={11} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
