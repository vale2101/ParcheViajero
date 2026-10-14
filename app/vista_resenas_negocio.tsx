import { ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '../src/components/ScreenHeader';
import ResenasNegocioSection from '../src/components/ResenasNegocioSection';

// Ruta alterna para ver la sección de reseñas del negocio sin backend ni login.
// Se abre en /vista_resenas_negocio
export default function PruebaResenasNegocio() {
  return (
    <>
      <ScreenHeader />
      <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
        <ResenasNegocioSection />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#FDFBF6' },
  content: { padding: 24 },
});
