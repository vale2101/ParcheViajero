import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useAppFonts } from '../src/hooks/useAppFonts';
import "../src/global.css";

export default function RootLayout() {
  const fontsReady = useAppFonts();


  if (!fontsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function Navigator() {
  const { user } = useAuth();
  const esNegocio = user?.tipo_usuario === 'negocio';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={!!user && !esNegocio}>
        <Stack.Screen name="usuario" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && esNegocio}>
        <Stack.Screen name="negocio" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Screen name="vista_resena" />

    </Stack>
  );
}
