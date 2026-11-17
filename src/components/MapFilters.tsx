import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import type { Categoria } from '../api/categoria';
import type { Municipio } from '../api/municipio';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { styles } from '../styles/MapFilters.styles';
import Chip from './Chip';
import HojaMunicipio from './HojaMunicipio';

export interface MapFiltersValue {
  categoriaId: string | null;
  municipioId: string | null;
  query: string;
}

interface Props {
  value: MapFiltersValue;
  onChange: (value: MapFiltersValue) => void;
  categorias: Categoria[];
  municipios: Municipio[];
}

export default function MapFilters({ value, onChange, categorias, municipios }: Props) {
  const [municipioModalVisible, setMunicipioModalVisible] = useState(false);
  const municipioSeleccionado = municipios.find((m) => m._id === value.municipioId);

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={value.query}
          onChangeText={(query) => onChange({ ...value, query })}
          placeholder="Busca un lugar por nombre"
          placeholderTextColor="#a3a3a3"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chipsRow}>
        <Chip
          label="Todas"
          active={!value.categoriaId}
          onPress={() => onChange({ ...value, categoriaId: null })}
        />

        {categorias.map((c) => {
          const visual = getCategoriaVisual(c.nombre);
          const active = value.categoriaId === c._id;
          return (
            <Chip
              key={c._id}
              label={`${visual.emoji} ${c.nombre}`}
              active={active}
              onPress={() => onChange({ ...value, categoriaId: active ? null : c._id })}
            />
          );
        })}

        <Chip
          label={municipioSeleccionado ? `📍 ${municipioSeleccionado.nombre}` : '📍 Municipio'}
          active={!!value.municipioId}
          onPress={() => setMunicipioModalVisible(true)}
        />
      </ScrollView>

      <HojaMunicipio
        visible={municipioModalVisible}
        municipios={municipios}
        seleccionadoId={value.municipioId}
        onCerrar={() => setMunicipioModalVisible(false)}
        onElegir={(id) => {
          onChange({ ...value, municipioId: id });
          setMunicipioModalVisible(false);
        }}
      />
    </View>
  );
}
