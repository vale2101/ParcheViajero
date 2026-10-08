import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';
import Button from '../../components/Button';
import Field from '../../components/Field';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/Login.styles';

type LoginForm = { email: string; contrasena: string };

export default function LoginScreen() {
  const { login } = useAuth();

  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', contrasena: '' },
  });

  const submit = async ({ email, contrasena }: LoginForm) => {
    try {
      await login(email, contrasena);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

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
          rules={{
            required: 'El correo es obligatorio',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
          }}
        />
        <Field
          control={control}
          name="contrasena"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={{ required: 'La contraseña es obligatoria' }}
        />

        {!!formState.errors.root && (
          <Text style={styles.errorBox}>{formState.errors.root.message}</Text>
        )}

        <Button
          text={formState.isSubmitting ? 'Entrando…' : 'Entrar'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting}
        />

        <Link href="/register" style={styles.link}>
          ¿No tienes cuenta? Regístrate
        </Link>
      </View>
    </KeyboardAwareScreen>
  );
}