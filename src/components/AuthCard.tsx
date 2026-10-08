import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

// Tarjeta centrada que usan las pantallas de login y registro
export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.center}
      keyboardShouldPersistTaps="handled">
      <View style={styles.card}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#e5e5e5' },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 384,
    gap: 20,
    borderRadius: 24,
    backgroundColor: '#FDFBF6',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});
