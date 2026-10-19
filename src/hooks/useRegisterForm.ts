import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import type { TipoUsuario } from '../api/usuario';

type RegisterForm = {
  nombre: string;
  email: string;
  contrasena: string;
  confirmacion: string;
  telefono: string;
};

export function useRegisterForm() {
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

  return {
    control,
    getValues,
    onSubmit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
    errorGeneral: formState.errors.root?.message ?? null,
    setTipoUsuario,
    esNegocio: tipoUsuario === 'negocio',
  };
}