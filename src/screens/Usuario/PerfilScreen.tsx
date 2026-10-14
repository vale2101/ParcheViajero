import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AvatarEditable from '../../components/AvatarEditable';
import FavoritosSection from '../../components/FavoritosSection';
import InfoModal from '../../components/InfoModal';
import MisResenasSection from '../../components/MisResenasSection';
import PerfilDrawer from '../../components/PerfilDrawer';
import ResenasSection from '../../components/ResenasSection';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/UsuarioPerfil.styles';

// >>> AQUÍ cambias el logo de fondo: pon la ruta de tu imagen dentro de assets <<<
const LOGO_FONDO = require('../../../assets/logo.jpeg');

interface Info {
  titulo: string;
  texto: string;
}

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);

  // Se espera a que el drawer termine de cerrarse antes de abrir la ventanita
  // (dos modales al mismo tiempo dan problemas en iOS)
  function mostrarInfo(titulo: string, texto: string) {
    setTimeout(() => setInfo({ titulo, texto }), 300);
  }

  function handleEditar() {
    // TODO: cuando exista la pantalla de editar perfil, navegar a ella
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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <AvatarEditable />
          <Text style={styles.name}>{user?.nombre}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <FavoritosSection />
        <MisResenasSection />
        

        {/* Logo difuminado al final de la pantalla */}
        <Image source={LOGO_FONDO} style={local.logo} resizeMode="contain" blurRadius={2} />
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

const local = StyleSheet.create({
  // opacity: qué tan tenue se ve (0 = invisible, 1 = normal)
  // height: tamaño del logo
  logo: { width: '100%', height: 150, opacity: 0.12 },
});
