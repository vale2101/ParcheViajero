import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';
import Button from '../../components/Button';
import Field from '../../components/Field';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { useLoginForm } from '../../hooks/useLoginForm';
import { reglaContrasenaLogin, reglaEmail } from '../../utils/validaciones';
import { styles } from '../../styles/Login.styles';

export default function LoginScreen() {
  const { control, onSubmit, isSubmitting, errorGeneral } = useLoginForm();

  return (
    <KeyboardAwareScreen style={styles.screen} contentContainerStyle={styles.center}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Parche Viajero"
          />
          <Text style={styles.subtitle}>Entra con tu cuenta</Text>
        </View>

        <Field
          control={control}
          name="email"
          label="Correo"
          keyboardType="email-address"
          placeholder="nombre@correo.com"
          rules={reglaEmail}
        />
        <Field
          control={control}
          name="contrasena"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={reglaContrasenaLogin}
        />

        {!!errorGeneral && <Text style={styles.errorBox}>{errorGeneral}</Text>}

        <Button
          text={isSubmitting ? 'Entrando…' : 'Entrar'}
          onPress={onSubmit}
          disabled={isSubmitting}
        />

        <Link href="/register" style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </View>
    </KeyboardAwareScreen>
  );
}