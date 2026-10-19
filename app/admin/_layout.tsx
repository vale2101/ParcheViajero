import { Stack } from 'expo-router';
import { AdminProvider } from '../../src/context/AdminContext';

export const unstable_settings = { initialRouteName: '(tabs)' };

export default function AdminLayout() {
  return (
    <AdminProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AdminProvider>
  );
}