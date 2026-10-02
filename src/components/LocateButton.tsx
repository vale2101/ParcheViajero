import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export default function LocateButton({ onPress, loading }: Props) {
  return (
    <Pressable style={styles.button} onPress={onPress} disabled={loading} hitSlop={8}>
      {loading ? (
        <ActivityIndicator color="#0147B9" size="small" />
      ) : (
        <Ionicons name="locate" size={22} color="#0147B9" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDFBF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
