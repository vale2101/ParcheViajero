import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

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
      setError('root', { message: (error as Error).message });
    }
  };

  return {
    control,
    onSubmit: handleSubmit(submit),
    isSubmitting: formState.isSubmitting,
    errorGeneral: formState.errors.root?.message ?? null,
  };
}