import { Text, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { styles } from '../../styles/NegocioMapa.styles';

export default function MapaNegocioScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Mapa / servicios / perfil</Text>
      </View>
    </View>
  );
}