import { Pressable, Text, View } from 'react-native';
import type { Categoria } from '../api/categoria';
import type { Servicio } from '../api/servicio';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { styles } from '../styles/UsuarioInicio.styles';
import CintaAdhesiva from './CintaAdhesiva';
import Foto from './Foto';
import FotoPlaceholder from './FotoPlaceholder';

interface Bloque {
  categoria: Categoria;
  lista: Servicio[];
}

interface Props {
  bloques: Bloque[];
  onElegir: (categoriaId: string) => void;
}

export default function PostalesCategoria({ bloques, onElegir }: Props) {
  return (
    <View style={styles.postalesGrilla}>
      {bloques.map((b, i) => {
        const visual = getCategoriaVisual(b.categoria.nombre);
        const portada = b.lista[0]?.imagenes?.[0]?.url_imagen;
        const n = b.lista.length;

        const giro = i % 2 === 0 ? '-3deg' : '2.5deg';

        return (
          <View
            key={b.categoria._id}
            style={[styles.postalWrap, { transform: [{ rotate: giro }] }]}>
            <CintaAdhesiva ancho={42} alto={14} rotacion={i % 2 === 0 ? '-8deg' : '7deg'} />
            <Pressable
              onPress={() => onElegir(b.categoria._id)}
              style={styles.postal}
              accessibilityRole="button"
              accessibilityLabel={`${b.categoria.nombre}, ${n} lugares`}>
              <View style={styles.postalFotoCaja}>
                {portada ? (
                  <Foto uri={portada} recyclingKey={b.categoria._id} style={styles.postalFoto} />
                ) : (
                  <FotoPlaceholder plano categoria={b.categoria.nombre} style={styles.postalFoto} />
                )}
              </View>
              <View style={styles.postalCuerpo}>
                <Text style={styles.postalEmoji}>{visual.emoji}</Text>
                <Text style={styles.postalNombre} numberOfLines={1}>
                  {b.categoria.nombre}
                </Text>
                <Text style={styles.postalCuenta}>
                  {n} {n === 1 ? 'parche' : 'parches'}
                </Text>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
