import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoMarca from './LogoMarca';
import { styles } from '../styles/Admin.styles';


export default function AdminHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <LogoMarca style={styles.headerLogo} />
    </View>
  );
}
