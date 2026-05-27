import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForgotPasswordMutation } from '@/features/auth/api/authApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

const schema = z.object({
  email: z.string().min(1, 'Введите email').email('Введите корректный email'),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPassword(values).unwrap();
      toast.success('Если такой email зарегистрирован, мы отправили ссылку');
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
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Отправить ссылку
      </Button>
      {isSuccess ? (
        <p className="text-sm text-gray-700">
          Если такой email зарегистрирован, мы отправили ссылку для
          восстановления.
        </p>
      ) : null}
    </form>
  );
}
