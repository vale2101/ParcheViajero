import { Pressable, Text, View } from 'react-native';
import type { Categoria } from '../api/categoria';
import type { Municipio } from '../api/municipio';
import { styles } from '../styles/Admin.styles';

interface Opcion {
  id: string | null;
  etiqueta: string;
}

function Chips({ opciones, valor, onChange }: { opciones: Opcion[]; valor: string | null; onChange: (id: string | null) => void }) {
  return (
    <View style={styles.chipsRow}>
      {opciones.map((o) => {
        const activo = o.id === valor;
        return (
          <Pressable
            key={o.id ?? 'todos'}
            style={[styles.chip, activo && styles.chipActive]}
            onPress={() => onChange(o.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: activo }}>
            <Text style={[styles.chipText, activo && styles.chipTextActive]}>{o.etiqueta}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface Props {
  categorias: Categoria[];
  municipios: Municipio[];
  categoriaId: string | null;
  municipioId: string | null;
  dias: number | null;
  onCategoria: (id: string | null) => void;
  onMunicipio: (id: string | null) => void;
  onDias: (dias: number | null) => void;
}

export default function FiltrosPanel({ categorias, municipios, categoriaId, municipioId, dias, onCategoria, onMunicipio, onDias }: Props) {
  return (
    <View style={styles.filterPanel}>
      <Text style={styles.filterLabel}>Categoría</Text>
      <Chips
        valor={categoriaId}
        onChange={onCategoria}
        opciones={[{ id: null, etiqueta: 'Todas' }, ...categorias.map((c) => ({ id: c._id, etiqueta: c.nombre }))]}
      />
      <Text style={styles.filterLabel}>Municipio</Text>
      <Chips
        valor={municipioId}
        onChange={onMunicipio}
        opciones={[{ id: null, etiqueta: 'Todos' }, ...municipios.map((m) => ({ id: m._id, etiqueta: m.nombre }))]}
      />
      <Text style={styles.filterLabel}>Fecha de creación</Text>
      <Chips
        valor={dias ? String(dias) : null}
        onChange={(id) => onDias(id ? Number(id) : null)}
        opciones={[
          { id: null, etiqueta: 'Siempre' },
          { id: '7', etiqueta: 'Últimos 7 días' },
          { id: '30', etiqueta: 'Últimos 30 días' },
        ]}
      />
    </View>
  );
}