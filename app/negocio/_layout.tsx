
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function NegocioTabsLayout() {
  return (
    <Tabs
      initialRouteName="mapa"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#a3a3a3',
        tabBarStyle: { backgroundColor: '#FDFBF6', borderTopColor: '#e5e5e5' },
      }}>
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="servicios"
        options={{
          title: 'Servicios',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}