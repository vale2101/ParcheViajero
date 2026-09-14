import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.tipo_usuario === 'negocio') {
    return <Redirect href="/mapa" />;
  }

  return <Redirect href="/inicio" />;
}