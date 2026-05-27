import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useRegisterMutation } from '@/features/auth/api/authApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const registerSchema = z
  .object({
    email: z.string().min(1, 'Введите email').email('Введите корректный email'),
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов'),
    passwordRepeat: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.passwordRepeat, {
    path: ['passwordRepeat'],
    message: 'Пароли не совпадают',
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [registerUser, { isLoading, isSuccess }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordRepeat: '',
    },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await registerUser({ email, password }).unwrap();
      toast.success('Проверьте email для подтверждения регистрации');
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Проверьте email для подтверждения регистрации.
        </p>
        <Link className="text-sm font-medium text-gray-900 underline" to="/login">
          Перейти на страницу входа
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Повтор пароля"
        type="password"
        autoComplete="new-password"
        error={errors.passwordRepeat?.message}
        {...register('passwordRepeat')}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        leftIcon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
      >
        Зарегистрироваться
      </Button>
      <p className="text-sm text-gray-600">
        Уже есть аккаунт?{' '}
        <Link className="text-gray-900 underline" to="/login">
          Войти
        </Link>
      </p>
    </form>
  );
}
