import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './Button';
import StarRating from './StarRating';

interface Props {
  calificacion: number;
  onCalificacionChange: (value: number) => void;
  comentario: string;
  onComentarioChange: (value: string) => void;
  error: string | null;
  submitting: boolean;
  onSubmit: () => void;
}

const MAX_CARACTERES = 200;
const ETIQUETAS = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

// Formulario para escribir una reseña nueva
export default function ResenaForm({
  calificacion,
  onCalificacionChange,
  comentario,
  onComentarioChange,
  error,
  submitting,
  onSubmit,
}: Props) {
  return (
    <View style={styles.formBox}>
      <Text style={styles.formTitle}>Escribe tu reseña</Text>

      <View style={styles.starsRow}>
        <StarRating value={calificacion} onChange={onCalificacionChange} size={26} />
        <Text style={styles.etiqueta}>{ETIQUETAS[calificacion]}</Text>
      </View>

      <TextInput
        style={styles.textarea}
        value={comentario}
        onChangeText={onComentarioChange}
        placeholder="¿Qué tal estuvo tu experiencia?"
        placeholderTextColor="#a3a3a3"
        multiline
        numberOfLines={3}
        maxLength={MAX_CARACTERES}
      />
      <Text style={styles.contador}>
        {comentario.length}/{MAX_CARACTERES}
      </Text>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        text={submitting ? 'Enviando…' : 'Publicar reseña'}
        onPress={onSubmit}
        disabled={submitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formBox: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  formTitle: { fontSize: 15, fontWeight: '700', color: '#1E3A8A' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  etiqueta: { fontSize: 13, color: '#737373' },
  textarea: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 12,
    fontSize: 14,
    color: '#171717',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  contador: { fontSize: 11, color: '#737373', textAlign: 'right' },
  errorText: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
});
