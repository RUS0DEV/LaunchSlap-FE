import { useGetAdminStatsQuery } from '@/features/admin/api/adminApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { formatPrice } from '@/shared/lib/formatPrice';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AdminSidebar } from '@/widgets/AdminSidebar';

export default function AdminStatsPage() {
  usePageTitle('Admin статистика');
  const { data, isLoading, error } = useGetAdminStatsQuery();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <AdminSidebar />
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">Статистика</h1>
          <p className="mt-1 text-sm text-gray-600">
            Основные показатели LaunchSlab.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32" />
            ))}
          </div>
        ) : null}
        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}

        {data ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-gray-500">Всего проектов</p>
              <p className="mt-2 text-3xl font-semibold text-gray-950">
                {data.projects_count}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-gray-500">Активных продвижений</p>
              <p className="mt-2 text-3xl font-semibold text-gray-950">
                {data.active_promotions_count}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-gray-500">Доход</p>
              <p className="mt-2 text-3xl font-semibold text-gray-950">
                {formatPrice(data.revenue_total)}
              </p>
            </Card>
          </div>
        ) : null}
      </section>
    </div>
  );
}
