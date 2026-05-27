import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} from '@/features/admin/api/adminApi';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Input } from '@/shared/ui/Input';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AdminSidebar } from '@/widgets/AdminSidebar';

const schema = z.object({
  max_featured_slots: z.coerce
    .number()
    .int('Укажите целое число')
    .min(1, 'Минимум 1')
    .max(100, 'Максимум 100'),
});

type Values = z.infer<typeof schema>;

export default function AdminSettingsPage() {
  usePageTitle('Admin настройки');
  const { data, isLoading, error } = useGetAdminSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] =
    useUpdateAdminSettingsMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      max_featured_slots: 1,
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateSettings(values).unwrap();
      toast.success('Настройки сохранены');
    } catch (submitError) {
      toast.error(getApiErrorMessage(submitError));
    }
  });

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <AdminSidebar />
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">Настройки</h1>
          <p className="mt-1 text-sm text-gray-600">
            Ограничения featured-секции.
          </p>
        </div>

        {isLoading ? <Skeleton className="h-48" /> : null}
        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}

        <Card className="p-5">
          <form className="max-w-sm space-y-4" onSubmit={onSubmit}>
            <Input
              label="Максимальное количество featured-проектов"
              type="number"
              min={1}
              max={100}
              error={errors.max_featured_slots?.message}
              {...register('max_featured_slots')}
            />
            <Button type="submit" isLoading={isSaving}>
              Сохранить
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
