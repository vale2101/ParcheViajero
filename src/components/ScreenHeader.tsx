import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Parche Viajero</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8D9B8',
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#0147B9',
    fontFamily: 'Fredoka_700Bold',
  },
});
