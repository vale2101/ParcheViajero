import { StyleSheet, Text } from 'react-native';

export default function ErrorBox({ message }: { message: string }) {
  return <Text style={styles.errorBox}>{message}</Text>;
}

const styles = StyleSheet.create({
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FDFBF6',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#dc2626',
  },
});
