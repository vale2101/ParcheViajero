import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import type { TipoUsuario } from '../api/usuario';

export type RegisterForm = {
  nombre: string;
  email: string;
  contrasena: string;
  confirmacion: string;
  telefono: string;
};

// Maneja el formulario de registro y el tipo de usuario (viajero o negocio)
export function useRegister() {
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

  // Validación de que las dos contraseñas sean iguales
  const validarConfirmacion = (value: string) =>
    value === getValues('contrasena') || 'Las contraseñas no coinciden';

  return {
    control,
    tipoUsuario,
    setTipoUsuario,
    esNegocio: tipoUsuario === 'negocio',
    validarConfirmacion,
    onSubmit: handleSubmit(submit),
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
