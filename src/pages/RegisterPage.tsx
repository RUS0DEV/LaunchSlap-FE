import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';

export default function RegisterPage() {
  usePageTitle('Регистрация');

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-950">Регистрация</h1>
        <p className="mt-2 text-sm text-gray-600">
          Создайте аккаунт автора LaunchSlab.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </Card>
    </div>
  );
}
