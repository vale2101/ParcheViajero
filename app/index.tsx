import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';


export default function Index() {
  const { user, isGuest } = useAuth();

  if (!user && !isGuest) {
    return <Redirect href="/login" />;
  }

  if (isGuest) {
    return <Redirect href="/usuario/mapa" />;
  }

  if (user?.tipo_usuario === 'admin') {
    return <Redirect href="/admin/inicio" />;
  }

  if (user?.tipo_usuario === 'negocio') {
    return <Redirect href="/negocio/tabs/mapa" />;
  }

  return <Redirect href="/usuario/inicio" />;
}