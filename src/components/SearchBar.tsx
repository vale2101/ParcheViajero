import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onFilter?: () => void;
  filterActive?: boolean;
}

export default function SearchBar({ value, onChange, placeholder, onFilter, filterActive }: Props) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={18} color={colors.textoSec} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {!!value && (
        <Pressable onPress={() => onChange('')} hitSlop={8} accessibilityLabel="Borrar búsqueda">
          <Ionicons name="close-circle" size={18} color={colors.placeholder} />
        </Pressable>
      )}
      {!!onFilter && (
        <Pressable
          style={[styles.searchFilterBtn, filterActive && styles.searchFilterBtnActive]}
          onPress={onFilter}
          accessibilityRole="button"
          accessibilityState={{ expanded: !!filterActive }}
          accessibilityLabel="Filtros">
          <Ionicons name="options-outline" size={20} color={colors.azul} />
        </Pressable>
      )}
    </View>
  );
}
