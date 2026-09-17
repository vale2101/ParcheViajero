import { Link } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { useAuth } from '../src/context/AuthContext';
import type { TipoUsuario } from '../src/api/usuario';

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
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.center}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 384,
    gap: 20,
    borderRadius: 24,
    backgroundColor: '#FDFBF6',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },
  toggleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FDFBF6',
  },
  toggleOptionActive: {
    backgroundColor: '#1E3A8A',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  toggleTextActive: {
    color: '#F5B700',
  },
  intro: {
    color: '#a3a3a3',
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FDFBF6',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#dc2626',
  },
  link: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#1E3A8A',
  },
});