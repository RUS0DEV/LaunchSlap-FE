import { Link } from 'react-router-dom';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export default function PaymentFailPage() {
  usePageTitle('Оплата не завершена');

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-950">
          Оплата не завершена
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Платёж был отменён или не прошёл.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button type="button">Вернуться в кабинет</Button>
        </Link>
      </Card>
    </div>
  );
}
