import { Link } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, Text, View } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import KeyboardAwareScreen from '../src/components/KeyboardAwareScreen';
import { useAuth } from '../src/context/AuthContext';
import type { TipoUsuario } from '../src/api/usuario';
import { styles } from '../src/styles/Register.styles';

type RegisterForm = {
  nombre: string;
  email: string;
  contrasena: string;
  confirmacion: string;
  telefono: string;
};

export default function Register() {
  const { register } = useAuth();
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>('registrado');

  const { control, handleSubmit, setError, getValues, formState } = useForm<RegisterForm>({
    defaultValues: { nombre: '', email: '', contrasena: '', confirmacion: '', telefono: '' },
  });

  const submit = async ({ nombre, email, contrasena, telefono }: RegisterForm) => {
    try {
      await register(nombre, email, contrasena, tipoUsuario, telefono || undefined);
    } catch (error) {
      setError('root', { message: (error as Error).message });
    }
  };

  const esNegocio = tipoUsuario === 'negocio';

  return (
    <KeyboardAwareScreen style={styles.screen} contentContainerStyle={styles.center}>
      <View style={styles.card}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Parche Viajero"
        />
        <Text style={styles.title}>
          Crear cuenta de {esNegocio ? 'negocio' : 'viajero'}
        </Text>

        <View style={styles.toggle}>
          <Pressable
            onPress={() => setTipoUsuario('registrado')}
            style={[styles.toggleOption, !esNegocio && styles.toggleOptionActive]}>
            <Text style={[styles.toggleText, !esNegocio && styles.toggleTextActive]}>
              Viajero
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTipoUsuario('negocio')}
            style={[styles.toggleOption, esNegocio && styles.toggleOptionActive]}>
            <Text style={[styles.toggleText, esNegocio && styles.toggleTextActive]}>
              Negocio
            </Text>
          </Pressable>
        </View>

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
          rules={{
            minLength: { value: 7, message: 'Mínimo 7 caracteres' },
          }}
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
            validate: (value) => value === getValues('contrasena') || 'Las contraseñas no coinciden',
          }}
        />

        {!!formState.errors.root && (
          <Text style={styles.errorBox}>{formState.errors.root.message}</Text>
        )}

        <Button
          text={formState.isSubmitting ? 'Creando…' : 'Crear cuenta'}
          onPress={handleSubmit(submit)}
          disabled={formState.isSubmitting}
        />

        <Link href="/login" style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </View>
    </KeyboardAwareScreen>
  );
}
