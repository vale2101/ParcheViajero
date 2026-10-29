import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import AvatarEditable from '../../components/AvatarEditable';
import DecoRutaCinta from '../../components/DecoRutaCinta';
import FavoritosSection from '../../components/FavoritosSection';
import InfoModal from '../../components/InfoModal';
import MisResenasSection from '../../components/MisResenasSection';
import MontanasDeco from '../../components/MontanasDeco';
import PerfilDrawer from '../../components/PerfilDrawer';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/UsuarioPerfil.styles';

interface Info {
  titulo: string;
  texto: string;
}

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);

  function mostrarInfo(titulo: string, texto: string) {
    setTimeout(() => setInfo({ titulo, texto }), 300);
  }

  function handleEditar() {
    mostrarInfo('Editar perfil', 'Esta opción estará disponible pronto.');
  }

  function handleAcerca() {
    mostrarInfo(
      'Acerca de la app',
      'Parche Viajero te ayuda a descubrir restaurantes, hoteles y lugares turísticos de Caldas, y a conocer lo que opinan otros viajeros.',
    );
  }

  function handleTerminos() {
    mostrarInfo(
      'Términos y condiciones',
      'Al usar Parche Viajero aceptas que tus reseñas sean públicas y que debes escribirlas con respeto. Esta app es un proyecto universitario.',
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader onPressMenu={() => setMenuVisible(true)} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.papelMancha1} pointerEvents="none" />
          <View style={styles.papelMancha2} pointerEvents="none" />
          <View style={styles.decoTopLeft} pointerEvents="none">
            <DecoRutaCinta />
          </View>
          <View style={styles.decoTopRight} pointerEvents="none">
            <MontanasDeco />
          </View>

          <View style={styles.profileHeader}>
            <AvatarEditable />
            <Text style={styles.name}>{user?.nombre}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <FavoritosSection />
        <MisResenasSection />

        <View style={styles.pie} pointerEvents="none">
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoFondo}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        </View>
      </ScrollView>

      <PerfilDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onEditar={handleEditar}
        onAcerca={handleAcerca}
        onTerminos={handleTerminos}
        onCerrarSesion={logout}
      />

      <InfoModal
        visible={!!info}
        titulo={info?.titulo ?? ''}
        texto={info?.texto ?? ''}
        onClose={() => setInfo(null)}
      />
    </View>
  );
}
