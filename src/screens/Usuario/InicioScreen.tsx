import { Text, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import { styles } from '../../styles/UsuarioInicio.styles';

export default function InicioScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Feed / mapa / perfil</Text>
      </View>
    </View>
  );
}