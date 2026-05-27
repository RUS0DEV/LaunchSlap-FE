import { Link, useParams } from 'react-router-dom';
import { useConfirmEmailQuery } from '@/features/auth/api/authApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Spinner } from '@/shared/ui/Spinner';

export default function ConfirmEmailPage() {
  usePageTitle('Подтверждение email');
  const { token = '' } = useParams();
  const { isLoading, isSuccess, error } = useConfirmEmailQuery(token, {
    skip: !token,
  });

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-950">
          Подтверждение email
        </h1>
        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Spinner className="h-5 w-5" />
              Проверяем ссылку
            </div>
          ) : null}
          {isSuccess ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">Email успешно подтверждён.</p>
              <Link to="/login">
                <Button type="button">Перейти ко входу</Button>
              </Link>
            </div>
          ) : null}
          {error || !token ? (
            <ErrorState
              title="Ссылка недействительна"
              description={
                token
                  ? getApiErrorMessage(error)
                  : 'Token подтверждения не найден.'
              }
              action={
                <Link className="text-sm font-medium underline" to="/login">
                  На страницу входа
                </Link>
              }
            />
          ) : null}
        </div>
      </Card>
    </div>
  );
}
