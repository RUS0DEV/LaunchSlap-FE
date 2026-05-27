import { useGetUserPaymentsQuery } from '@/features/payments/api/paymentsApi';
import { paymentStatusLabels } from '@/shared/constants/statusLabels';
import { promotionTypeLabels } from '@/shared/constants/promotionPlans';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Skeleton } from '@/shared/ui/Skeleton';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';

const paymentTone = {
  pending: 'warning',
  succeeded: 'success',
  failed: 'danger',
  refunded: 'neutral',
} as const;

export default function PaymentsPage() {
  usePageTitle('История оплат');
  const { data: payments = [], isLoading, error } = useGetUserPaymentsQuery();

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <DashboardSidebar />
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">История оплат</h1>
          <p className="mt-1 text-sm text-gray-600">
            Платежи за featured-продвижение.
          </p>
        </div>

        {isLoading ? <Skeleton className="h-80" /> : null}
        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}
        {!isLoading && !error && !payments.length ? (
          <EmptyState title="Оплат пока нет" />
        ) : null}

        {payments.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Проект</th>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3">Провайдер</th>
                  <th className="px-4 py-3">Сумма</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3">{formatDate(payment.created_at)}</td>
                    <td className="px-4 py-3">
                      {payment.project?.name || payment.project_name || payment.project_id}
                    </td>
                    <td className="px-4 py-3">
                      {promotionTypeLabels[payment.promotion_type]}
                    </td>
                    <td className="px-4 py-3">{payment.provider}</td>
                    <td className="px-4 py-3">{formatPrice(payment.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={paymentTone[payment.status]}>
                        {paymentStatusLabels[payment.status]}
                      </Badge>
                    </td>
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
