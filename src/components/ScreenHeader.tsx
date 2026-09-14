import { StyleSheet, Text, View } from 'react-native';

export default function ScreenHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Parche Viajero</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#1E3A8A',
  },
});