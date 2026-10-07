import { ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/LocateButton.styles';

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
