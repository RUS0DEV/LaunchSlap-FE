import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '@/features/auth/ui/ResetPasswordForm';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';

export default function ResetPasswordPage() {
  usePageTitle('Новый пароль');
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get('token') || '';

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-950">Новый пароль</h1>
        <div className="mt-6">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <ErrorState
              title="Не хватает token"
              description="Ссылка восстановления недействительна или устарела."
              action={
                <Link className="text-sm font-medium underline" to="/forgot-password">
                  Запросить новую ссылку
                </Link>
              }
            />
          )}
        </div>
      </Card>
    </div>
  );
}
