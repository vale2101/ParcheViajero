import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

export type LoginForm = { email: string; contrasena: string };

// Maneja el formulario de login y llama al login del contexto
export function useLogin() {
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

  return {
    control,
    onSubmit: handleSubmit(submit),
    error: formState.errors.root?.message,
    isSubmitting: formState.isSubmitting,
  };
}
