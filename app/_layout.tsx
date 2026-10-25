import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '../src/context/AlertContext';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { FavoritosProvider } from '../src/context/FavoritosContext';
import { useAppFonts } from '../src/hooks/useAppFonts';
import Loader from '../src/components/Loader';
import "../src/global.css";

export default function RootLayout() {
  const fontsReady = useAppFonts();

  if (!fontsReady) {
    return <Loader tipo="pantalla" texto="Preparando Parche Viajero…" />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AlertProvider>
        <AuthProvider>
          <FavoritosProvider>
            <Navigator />
          </FavoritosProvider>
        </AuthProvider>
      </AlertProvider>
    </SafeAreaProvider>
  );
}

function Navigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader tipo="pantalla" texto="Cargando tu sesión…" />;
  }

  const esNegocio = user?.tipo_usuario === 'negocio';
  const esAdmin = user?.tipo_usuario === 'admin';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!!user && !esNegocio && !esAdmin}>
        <Stack.Screen name="usuario" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && esNegocio}>
        <Stack.Screen name="negocio" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && esAdmin}>
        <Stack.Screen name="admin" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>
    </Stack>
  );
}