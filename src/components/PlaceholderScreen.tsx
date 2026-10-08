import { StyleSheet, Text, View } from 'react-native';
import ScreenHeader from './ScreenHeader';

// Pantalla vacía con un texto en el centro (para las pantallas que aún no se hacen)
export default function PlaceholderScreen({ texto }: { texto: string }) {
  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <Text style={styles.placeholder}>{texto}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { color: '#a3a3a3', fontSize: 15 },
});
