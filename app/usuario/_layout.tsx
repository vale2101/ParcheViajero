import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

const ICONOS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  inicio: { on: 'home', off: 'home-outline' },
  mapa: { on: 'map', off: 'map-outline' },
  perfil: { on: 'person', off: 'person-outline' },
};

export default function UsuarioTabsLayout() {
  const { isGuest } = useAuth();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#123B79',
        tabBarInactiveTintColor: '#8C98AE',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarIcon: ({ color, size, focused }) => {
          const par = ICONOS[route.name] ?? { on: 'ellipse', off: 'ellipse-outline' };
          const tintColor = typeof color === 'number' ? '#123B79' : color;
          return (
            <Ionicons
              name={focused ? par.on : par.off}
              size={size + 2}
              color={tintColor ?? '#123B79'}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: '#FFF8E9',
          borderTopColor: '#E8D4AE',
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
      })}>
      <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="mapa" options={{ title: 'Mapa' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', href: isGuest ? null : undefined }} />
    </Tabs>
  );
}
