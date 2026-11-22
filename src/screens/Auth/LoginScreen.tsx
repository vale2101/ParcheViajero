import { Link } from 'expo-router';
import { Image, Text, View, useWindowDimensions } from 'react-native';
import { Image as Fondo } from 'expo-image';
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
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.fondo, { width, minHeight: height, backgroundColor: '#E8D4AE' }]}>
      <Fondo
        source={require('../../../assets/fotofondo.jpg')}
        style={[styles.fotoFondo, { width, height }]}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={120}
        priority="high"
      />
    <KeyboardAwareScreen style={styles.screen} contentContainerStyle={styles.center}>
      <View style={styles.card}>
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

        <Link href="/register" style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </View>
    </KeyboardAwareScreen>
    </View>
  );
}