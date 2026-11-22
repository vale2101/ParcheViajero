import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Button from '../../components/Button';
import Field from '../../components/Field';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { useLoginForm } from '../../hooks/useLoginForm';
import { reglaContrasenaLogin, reglaEmail } from '../../utils/validaciones';
import { styles } from '../../styles/Login.styles';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { control, onSubmit, isSubmitting, errorGeneral } = useLoginForm();
  const { continueAsGuest } = useAuth();

  return (
    <KeyboardAwareScreen style={styles.screen} contentContainerStyle={styles.center}>
      <Animated.View entering={FadeIn.duration(280)} style={styles.card}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Parche Viajero"
          />
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
          style={styles.botonEntrar}
        />

        <Button
          text="Continuar como invitado"
          onPress={continueAsGuest}
          secondary
          style={styles.botonInvitado}
        />

        <Link href="/register" replace style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </Animated.View>
    </KeyboardAwareScreen>
  );
}
