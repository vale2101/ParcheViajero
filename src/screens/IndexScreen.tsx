import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Decide a dónde mandar al usuario según si inició sesión y su tipo
export default function IndexScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.tipo_usuario === 'negocio') {
    return <Redirect href="/negocio/mapa" />;
  }

  return <Redirect href="/usuario/inicio" />;
}
