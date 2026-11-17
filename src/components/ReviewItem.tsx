import { memo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles/ReviewItem.styles';
import StarRating from './StarRating';

const LINEAS_RESUMEN = 4;

function haceCuanto(fecha?: string) {
  if (!fecha) return '';
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
  if (Number.isNaN(dias) || dias <= 0) return 'hoy';
  if (dias === 1) return 'hace 1 día';
  return `hace ${dias} días`;
}

interface Props {
  autor: string;
  calificacion: number;
  fecha?: string;
  comentario?: string;
}

function ReviewItem({ autor, calificacion, fecha, comentario }: Props) {
  const [expandido, setExpandido] = useState(false);
  const [desborda, setDesborda] = useState(false);
  const texto = comentario?.trim() ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.autor} numberOfLines={1}>
          {autor}
        </Text>
        {!!fecha && <Text style={styles.fecha}>{haceCuanto(fecha)}</Text>}
      </View>
      <StarRating value={calificacion} readonly size={14} />
      {!!texto && (
        <>
          {!desborda && !expandido && (
            <Text
              style={[styles.comentario, { position: 'absolute', opacity: 0 }]}
              onTextLayout={(e) => {
                if (e.nativeEvent.lines.length > LINEAS_RESUMEN) {
                  setDesborda(true);
                }
              }}>
              {texto}
            </Text>
          )}
          <Text
            style={styles.comentario}
            numberOfLines={expandido ? undefined : LINEAS_RESUMEN}>
            {texto}
          </Text>
          {desborda && (
            <Pressable
              onPress={() => setExpandido((v) => !v)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={expandido ? 'Ver menos' : 'Ver más'}>
              <Text style={styles.verMas}>{expandido ? 'Ver menos' : 'Ver más'}</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

export default memo(ReviewItem);
