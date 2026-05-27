import { LoginForm } from '@/features/auth/ui/LoginForm';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';

export default function LoginPage() {
  usePageTitle('Вход');

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-950">Вход</h1>
        <p className="mt-2 text-sm text-gray-600">
          Войдите, чтобы управлять проектами и продвижением.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
