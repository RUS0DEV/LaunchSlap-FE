import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAppDispatch } from '@/app/hooks';
import {
  getAuthToken,
  useLazyGetMeQuery,
  useLoginMutation,
} from '@/features/auth/api/authApi';
import { setCredentials, setUser } from '@/features/auth/model/authSlice';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const loginSchema = z.object({
  email: z.string().min(1, 'Введите email').email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const auth = await login(values).unwrap();
      const token = getAuthToken(auth);

      if (!token) {
        throw new Error('Backend не вернул JWT');
      }

      dispatch(setCredentials({ token, user: auth.user || null }));
      const user = auth.user || (await getMe().unwrap());
      dispatch(setUser(user));
      navigate(user.role === 'admin' ? '/admin/projects' : '/dashboard', {
        replace: true,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        leftIcon={<LogIn className="h-4 w-4" aria-hidden="true" />}
      >
        Войти
      </Button>
      <div className="flex items-center justify-between text-sm">
        <Link className="text-gray-700 underline" to="/forgot-password">
          Забыли пароль?
        </Link>
        <Link className="text-gray-700 underline" to="/register">
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
}
