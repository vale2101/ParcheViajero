import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';
import { useAdmin } from '../../../src/context/AdminContext';

function icono(nombre: keyof typeof Ionicons.glyphMap) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={nombre} size={size} color={color as string} />
  );
}

export default function AdminTabsLayout() {
  const { resumen } = useAdmin();
  const pendientes = resumen?.pendientes ?? 0;

  return (
    <Tabs
      initialRouteName="inicio"
      screenOptions={{
        headerShown: false,
        tabBarPosition: 'bottom',
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#a3a3a3',
        tabBarStyle: { backgroundColor: '#FDFBF6', borderTopColor: '#e5e5e5' },
      }}>
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarIcon: icono('home-outline') }} />
      <Tabs.Screen
        name="solicitudes"
        options={{
          title: 'Solicitudes',
          tabBarIcon: icono('document-text-outline'),
          tabBarBadge: pendientes > 0 ? pendientes : undefined,
          tabBarBadgeStyle: { backgroundColor: '#FEBA03', color: '#171717' },
        }}
      />
      <Tabs.Screen name="servicios" options={{ title: 'Servicios', tabBarIcon: icono('storefront-outline') }} />
      <Tabs.Screen name="usuarios" options={{ title: 'Usuarios', tabBarIcon: icono('people-outline') }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: icono('person-outline') }} />
      <Tabs.Screen name="resenas" options={{ title: 'Reseñas', tabBarIcon: icono('chatbubbles-outline') }} />
    </Tabs>
  );
}