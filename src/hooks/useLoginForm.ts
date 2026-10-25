import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

type LoginForm = { email: string; contrasena: string };

export function useLoginForm() {
  const { login } = useAuth();
  const { errorVital } = useAlert();

  const { control, handleSubmit, setError, formState } = useForm<LoginForm>({
    defaultValues: { email: '', contrasena: '' },
  });

  const submit = async ({ email, contrasena }: LoginForm) => {
    try {
      await login(email, contrasena);
    } catch (error) {
      setError('root', {
        message: errorVital(
          'Error al iniciar sesión',
          error,
          'No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.',
          'No se pudo entrar',
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