import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/Admin.styles';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={18} color="#6b6b6b" />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#a3a3a3"
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {!!value && (
        <Pressable onPress={() => onChange('')} hitSlop={8} accessibilityLabel="Borrar búsqueda">
          <Ionicons name="close-circle" size={18} color="#a3a3a3" />
        </Pressable>
      )}
    </View>
  );
}