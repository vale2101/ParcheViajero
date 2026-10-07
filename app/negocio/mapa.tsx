import { Text, View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';
import { styles } from '../../src/styles/NegocioMapa.styles';

export default function Mapa() {
  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Mapa / servicios / perfil</Text>
      </View>
    </View>
  );
}
