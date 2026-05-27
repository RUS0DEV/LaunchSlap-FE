import { ForgotPasswordForm } from '@/features/auth/ui/ForgotPasswordForm';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';

export default function ForgotPasswordPage() {
  usePageTitle('Восстановление пароля');

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-950">
          Восстановление пароля
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Укажите email, и мы отправим ссылку для восстановления, если аккаунт
          существует.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </Card>
    </div>
  );
}
