import { Link } from 'react-router-dom';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';

export default function ForbiddenPage() {
  usePageTitle('Нет доступа');

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <ErrorState
        title="Нет доступа"
        description="Эта страница доступна только администратору."
        action={
          <Link to="/dashboard">
            <Button type="button" variant="secondary">
              Вернуться в кабинет
            </Button>
          </Link>
        }
      />
    </div>
  );
}
