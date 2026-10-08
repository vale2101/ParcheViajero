import { StyleSheet, View } from 'react-native';
import ProfileHeader from '../components/ProfileHeader';
import ScreenHeader from '../components/ScreenHeader';

export default function PerfilNegocioScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <View style={styles.content}>
        <ProfileHeader />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFBF6' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
});
