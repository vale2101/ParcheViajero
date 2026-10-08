import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import AuthCard from '../components/AuthCard';
import Button from '../components/Button';
import ErrorBox from '../components/ErrorBox';
import Field from '../components/Field';
import Toggle from '../components/Toggle';
import { useRegister } from '../hooks/useRegister';

export default function RegisterScreen() {
  const {
    control,
    tipoUsuario,
    setTipoUsuario,
    esNegocio,
    validarConfirmacion,
    onSubmit,
    error,
    isSubmitting,
  } = useRegister();

  return (
    <AuthCard>
      <Text style={styles.title}>Crear cuenta de {esNegocio ? 'negocio' : 'viajero'}</Text>

      <Toggle
        value={tipoUsuario}
        onChange={setTipoUsuario}
        options={[
          { value: 'registrado', label: 'Viajero' },
          { value: 'negocio', label: 'Negocio' },
        ]}
      />

      <Text style={styles.intro}>
        {esNegocio
          ? 'Registra tu negocio para publicar tus servicios en Parche Viajero.'
          : 'Crea tu cuenta para explorar y guardar tus lugares favoritos.'}
      </Text>

      <Field
        control={control}
        name="nombre"
        label="Nombre completo"
        autoCapitalize="words"
        placeholder="Juan Pérez"
        rules={{
          required: 'El nombre es obligatorio',
          minLength: { value: 3, message: 'Mínimo 3 caracteres' },
        }}
      />
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
        name="telefono"
        label="Teléfono"
        keyboardType="phone-pad"
        placeholder="3001234567"
        rules={{ minLength: { value: 7, message: 'Mínimo 7 caracteres' } }}
      />
      <Field
        control={control}
        name="contrasena"
        label="Contraseña"
        secureTextEntry
        placeholder="••••••••"
        rules={{
          required: 'La contraseña es obligatoria',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        }}
      />
      <Field
        control={control}
        name="confirmacion"
        label="Confirmar contraseña"
        secureTextEntry
        placeholder="••••••••"
        rules={{
          required: 'Confirma la contraseña',
          validate: validarConfirmacion,
        }}
      />

      {!!error && <ErrorBox message={error} />}

      <Button
        text={isSubmitting ? 'Creando…' : 'Crear cuenta'}
        onPress={onSubmit}
        disabled={isSubmitting}
      />

      <Link href="/login" style={styles.link}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '700', color: '#1E3A8A' },
  intro: { color: '#a3a3a3' },
  link: { textAlign: 'center', fontWeight: '500', color: '#1E3A8A' },
});
