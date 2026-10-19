import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { logError, mensajeErrorUsuario } from '../utils/errorApp';

type LoginForm = { email: string; contrasena: string };

export function useLoginForm() {
  const { login } = useAuth();

  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', contrasena: '' },
  });

  const submit = async ({ email, contrasena }: LoginForm) => {
    try {
      await login(email, contrasena);
    } catch (error) {
      logError('Error al iniciar sesión', error);
      setError('root', {
        message: mensajeErrorUsuario(
          error,
          'No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.',
        ),
      });
    }
  };

  return {
    control,
    onSubmit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
    errorGeneral: formState.errors.root?.message ?? null,
  };
}