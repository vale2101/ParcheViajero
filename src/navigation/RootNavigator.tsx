import { Stack } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Define qué pantallas puede ver cada tipo de usuario
export default function RootNavigator() {
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
    </Stack>
  );
}
