import { Text, View } from 'react-native';
import { styles } from '../styles/FavoritosSection.styles';

export default function FavoritosSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mis favoritos</Text>
      <View style={styles.emptyBox}>
        <Text style={styles.placeholder}>Aún no tienes favoritos guardados</Text>
      </View>
    </View>
  );
}
