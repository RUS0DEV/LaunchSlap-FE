import { Link } from 'react-router-dom';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

export default function NotFoundPage() {
  usePageTitle('Не найдено');

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <EmptyState
        title="Страница не найдена"
        description="Проверьте адрес или вернитесь в каталог."
        action={
          <Link to="/">
            <Button type="button">В каталог</Button>
          </Link>
        }
      />
    </div>
  );
}
