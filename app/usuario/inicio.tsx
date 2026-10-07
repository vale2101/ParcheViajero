import { Text, View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';
import { styles } from '../../src/styles/UsuarioInicio.styles';

export default function Inicio() {
  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <Text style={styles.placeholder}>Feed / mapa / perfil</Text>
      </View>
    </View>
  );
}
