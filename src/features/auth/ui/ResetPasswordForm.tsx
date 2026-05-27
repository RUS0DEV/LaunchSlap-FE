import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useResetPasswordMutation } from '@/features/auth/api/authApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Пароль должен содержать минимум 8 символов'),
    passwordRepeat: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.passwordRepeat, {
    path: ['passwordRepeat'],
    message: 'Пароли не совпадают',
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', passwordRepeat: '' },
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Пароль обновлён');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Input
        label="Новый пароль"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Повтор нового пароля"
        type="password"
        autoComplete="new-password"
        error={errors.passwordRepeat?.message}
        {...register('passwordRepeat')}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Сохранить пароль
      </Button>
    </form>
  );
}
