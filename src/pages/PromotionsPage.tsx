import { useGetMyPromotionsQuery } from '@/features/promotions/api/promotionsApi';
import { promotionTypeLabels } from '@/shared/constants/promotionPlans';
import { promotionStatusLabels } from '@/shared/constants/statusLabels';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/formatDate';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Skeleton } from '@/shared/ui/Skeleton';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';

const promotionTone = {
  active: 'success',
  expired: 'neutral',
  cancelled: 'danger',
} as const;

export default function PromotionsPage() {
  usePageTitle('Мои продвижения');
  const { data: promotions = [], isLoading, error } = useGetMyPromotionsQuery();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <DashboardSidebar />
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">
            Мои продвижения
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Активные и завершённые featured-размещения.
          </p>
        </div>

        {isLoading ? <Skeleton className="h-80" /> : null}
        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}
        {!isLoading && !error && !promotions.length ? (
          <EmptyState title="Продвижений пока нет" />
        ) : null}

        {promotions.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Проект</th>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Начало</th>
                  <th className="px-4 py-3">Окончание</th>
                  <th className="px-4 py-3">Оплата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.id}>
                    <td className="px-4 py-3">
                      {promotion.project_name || promotion.project_id}
                    </td>
                    <td className="px-4 py-3">
                      {promotionTypeLabels[promotion.type]}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={promotionTone[promotion.status]}>
                        {promotionStatusLabels[promotion.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{formatDate(promotion.starts_at)}</td>
                    <td className="px-4 py-3">
                      {promotion.ends_at
                        ? formatDate(promotion.ends_at)
                        : 'Активна до отмены'}
                    </td>
                    <td className="px-4 py-3">{promotion.payment_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
