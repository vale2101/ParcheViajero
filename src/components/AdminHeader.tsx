import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../styles/Admin.styles';


export default function AdminHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.headerLogo}
        resizeMode="contain"
        accessibilityLabel="Parche Viajero"
      />
    </View>
  );
}
