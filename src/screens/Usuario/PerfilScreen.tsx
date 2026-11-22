import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import AvatarEditable from '../../components/AvatarEditable';
import DecoRutaCinta from '../../components/DecoRutaCinta';
import FavoritosSection from '../../components/FavoritosSection';
import InfoModal from '../../components/InfoModal';
import MisResenasSection from '../../components/MisResenasSection';
import MontanasDeco from '../../components/MontanasDeco';
import PerfilDrawer from '../../components/PerfilDrawer';
import EntradaPantalla from '../../components/EntradaPantalla';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/UsuarioPerfil.styles';
import { useResponsive } from '../../hooks/useResponsive';

interface Info {
  titulo: string;
  texto: string;
}

export default function PerfilScreen() {
  const { user, isGuest, logout } = useAuth();
  const { pad, maxContenido } = useResponsive();
  const [menuVisible, setMenuVisible] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);

  function mostrarInfo(titulo: string, texto: string) {
    setInfo({ titulo, texto });
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

  if (isGuest) {
    return <Redirect href="/usuario/inicio" />;
  }

  return (
    <View style={styles.screen}>
      <EntradaPantalla>
        <ScreenHeader onPressMenu={() => setMenuVisible(true)} />
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: pad, maxWidth: maxContenido, alignSelf: 'center', width: '100%' },
          ]}
          showsVerticalScrollIndicator={false}>
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
      </EntradaPantalla>
      <PerfilDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
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
