import { StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';

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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: '#a3a3a3', fontSize: 15 },
});