import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Categoria } from '../api/categoria';
import type { Municipio } from '../api/municipio';
import { getCategoriaVisual } from '../utils/categoriaVisual';

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

      <Modal
        visible={municipioModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setMunicipioModalVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setMunicipioModalVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Municipio</Text>

            <Pressable
              style={styles.option}
              onPress={() => {
                onChange({ ...value, municipioId: null });
                setMunicipioModalVisible(false);
              }}>
              <Text style={[styles.optionText, !value.municipioId && styles.optionTextActive]}>
                Todos
              </Text>
            </Pressable>

            {municipios.map((m) => (
              <Pressable
                key={m._id}
                style={styles.option}
                onPress={() => {
                  onChange({ ...value, municipioId: m._id });
                  setMunicipioModalVisible(false);
                }}>
                <Text
                  style={[
                    styles.optionText,
                    value.municipioId === m._id && styles.optionTextActive,
                  ]}>
                  {m.nombre}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    gap: 8,
    borderRadius: 24,
    backgroundColor: '#FDFBF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: '#171717' },
  chipsScroll: { flexGrow: 0 },
  chipsRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8D9B8',
    backgroundColor: '#FDFBF6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: '#0147B9',
    borderColor: '#0147B9',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#0147B9' },
  chipTextActive: { color: '#FEBA03' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FAF4E4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: '#0147B9', marginBottom: 12 },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E8D9B8' },
  optionText: { fontSize: 15, color: '#171717' },
  optionTextActive: { color: '#0147B9', fontWeight: '700' },
});
