import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import Button from '../../components/Button';
import Field from '../../components/Field';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import {
  reglaConfirmacion,
  reglaContrasenaNueva,
  reglaEmail,
  reglaNombre,
  reglaTelefonoOpcional,
} from '../../utils/validaciones';
import { styles } from '../../styles/Register.styles';

export default function RegisterScreen() {
  const { control, getValues, onSubmit, isSubmitting, errorGeneral, setTipoUsuario, esNegocio } =
    useRegisterForm();

  return (
    <KeyboardAwareScreen style={styles.screen} contentContainerStyle={styles.center}>
      <View style={styles.card}>
        <Image
          source={require('../../../assets/logo.png')}
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
          rules={reglaNombre}
        />
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
          name="telefono"
          label="Teléfono"
          keyboardType="phone-pad"
          placeholder="3001234567"
          rules={reglaTelefonoOpcional}
        />
        <Field
          control={control}
          name="contrasena"
          label="Contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={reglaContrasenaNueva}
        />
        <Field
          control={control}
          name="confirmacion"
          label="Confirmar contraseña"
          secureTextEntry
          placeholder="••••••••"
          rules={reglaConfirmacion(() => getValues('contrasena'))}
        />

        {!!errorGeneral && <Text style={styles.errorBox}>{errorGeneral}</Text>}

        <Button
          text={isSubmitting ? 'Creando…' : 'Crear cuenta'}
          onPress={onSubmit}
          disabled={isSubmitting}
        />

        <Link href="/login" style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </View>
    </KeyboardAwareScreen>
  );
}