import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import ErrorBox from '../components/ErrorBox';
import Field from '../components/Field';
import { useLogin } from '../hooks/useLogin';

export default function LoginScreen() {
  const { control, onSubmit, error, isSubmitting } = useLogin();

  return (
    <AuthCard>
      <View style={styles.header}>
        <Text style={styles.title}>Parche Viajero</Text>
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

      {!!error && <ErrorBox message={error} />}

      <Button
        text={isSubmitting ? 'Entrando…' : 'Entrar'}
        onPress={onSubmit}
        disabled={isSubmitting}
      />

      <Link href="/register" style={styles.link}>
        ¿No tienes cuenta? Regístrate
      </Link>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4 },
  title: { fontSize: 24, fontWeight: '700', color: '#1E3A8A' },
  subtitle: { color: '#a3a3a3' },
  link: { textAlign: 'center', fontWeight: '500', color: '#1E3A8A' },
});
