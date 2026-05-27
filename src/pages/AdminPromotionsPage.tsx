import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  useCreateAdminPromotionMutation,
  useDeleteAdminPromotionMutation,
  useGetAdminPromotionsQuery,
} from '@/features/admin/api/adminApi';
import { promotionPlans, promotionTypeLabels } from '@/shared/constants/promotionPlans';
import { promotionStatusLabels } from '@/shared/constants/statusLabels';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/formatDate';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AdminSidebar } from '@/widgets/AdminSidebar';

const schema = z.object({
  project_id: z.string().min(1, 'Укажите project_id'),
  type: z.enum(['boost_7', 'boost_30', 'sub_monthly', 'sub_yearly']),
  starts_at: z.string().min(1, 'Укажите дату начала'),
  ends_at: z.string().optional(),
});

type Values = z.infer<typeof schema>;

const promotionTone = {
  active: 'success',
  expired: 'neutral',
  cancelled: 'danger',
} as const;

export default function AdminPromotionsPage() {
  usePageTitle('Admin featured');
  const { data: promotions = [], isLoading, error } = useGetAdminPromotionsQuery();
  const [createPromotion, { isLoading: isCreating }] =
    useCreateAdminPromotionMutation();
  const [deletePromotion, { isLoading: isDeleting }] =
    useDeleteAdminPromotionMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: '',
      type: 'boost_7',
      starts_at: new Date().toISOString().slice(0, 10),
      ends_at: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createPromotion({
        ...values,
        ends_at: values.ends_at || undefined,
      }).unwrap();
      toast.success('Featured добавлен');
      reset();
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError));
    }
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePromotion(id).unwrap();
      toast.success('Featured снят');
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <AdminSidebar />
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">
            Управление featured
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Активные продвижения и ручное добавление featured.
          </p>
        </div>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-gray-950">
            Добавить featured вручную
          </h2>
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <Input
              label="project_id"
              error={errors.project_id?.message}
              {...register('project_id')}
            />
            <Select label="Тип" error={errors.type?.message} {...register('type')}>
              {promotionPlans.map((plan) => (
                <option key={plan.type} value={plan.type}>
                  {plan.name}
                </option>
              ))}
            </Select>
            <Input
              label="Дата начала"
              type="date"
              error={errors.starts_at?.message}
              {...register('starts_at')}
            />
            <Input
              label="Дата окончания"
              type="date"
              error={errors.ends_at?.message}
              {...register('ends_at')}
            />
            <div className="md:col-span-2">
              <Button type="submit" isLoading={isCreating}>
                Добавить featured
              </Button>
            </div>
          </form>
        </Card>

        {isLoading ? <Skeleton className="h-80" /> : null}
        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}
        {!isLoading && !error && !promotions.length ? (
          <EmptyState title="Активных продвижений нет" />
        ) : null}

        {promotions.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Проект</th>
                  <th className="px-4 py-3">Тип</th>
                  <th className="px-4 py-3">Начало</th>
                  <th className="px-4 py-3">Окончание</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Действия</th>
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
                    <td className="px-4 py-3">{formatDate(promotion.starts_at)}</td>
                    <td className="px-4 py-3">
                      {promotion.ends_at
                        ? formatDate(promotion.ends_at)
                        : 'Активна до отмены'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={promotionTone[promotion.status]}>
                        {promotionStatusLabels[promotion.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        isLoading={isDeleting}
                        onClick={() => handleDelete(promotion.id)}
                      >
                        Снять с featured
                      </Button>
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
