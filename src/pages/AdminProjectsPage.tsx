import { useState } from 'react';
import { toast } from 'sonner';
import type { Project } from '@/entities/project/model/types';
import {
  useDeleteAdminProjectMutation,
  useGetAdminProjectsQuery,
  useHideProjectMutation,
  useShowProjectMutation,
} from '@/features/admin/api/adminApi';
import { getCategoryLabel } from '@/shared/constants/categories';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/formatDate';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Modal } from '@/shared/ui/Modal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { AdminSidebar } from '@/widgets/AdminSidebar';

export default function AdminProjectsPage() {
  usePageTitle('Admin проекты');
  const { data, isLoading, error } = useGetAdminProjectsQuery({
    page: 1,
    limit: 50,
  });
  const [hideProject] = useHideProjectMutation();
  const [showProject] = useShowProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] =
    useDeleteAdminProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const projects = data?.items || [];

  const runAction = async (
    action: () => Promise<unknown>,
    successMessage: string,
  ) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (actionError) {
      toast.error(getApiErrorMessage(actionError));
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) {
      return;
    }

    await runAction(
      () => deleteProject(projectToDelete.id).unwrap(),
      'Проект удалён',
    );
    setProjectToDelete(null);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <AdminSidebar />
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">
            Управление проектами
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Скрытие, показ и удаление проектов каталога.
          </p>
        </div>

        {isLoading ? <Skeleton className="h-96" /> : null}
        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}
        {!isLoading && !error && !projects.length ? (
          <EmptyState title="Проектов нет" />
        ) : null}

        {projects.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Изображение</th>
                  <th className="px-4 py-3">Название</th>
                  <th className="px-4 py-3">Автор</th>
                  <th className="px-4 py-3">Категория</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-4 py-3">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="h-12 w-16 rounded object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">Нет</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-4 py-3">
                      {project.user_email || project.user_id}
                    </td>
                    <td className="px-4 py-3">{getCategoryLabel(project.category)}</td>
                    <td className="px-4 py-3">
                      {project.is_featured ? (
                        <Badge tone="featured">Да</Badge>
                      ) : (
                        <Badge>Нет</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={project.is_hidden ? 'danger' : 'success'}>
                        {project.is_hidden ? 'Скрыт' : 'Активен'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{formatDate(project.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {project.is_hidden ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              runAction(
                                () => showProject(project.id).unwrap(),
                                'Проект опубликован',
                              )
                            }
                          >
                            Показать
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              runAction(
                                () => hideProject(project.id).unwrap(),
                                'Проект скрыт',
                              )
                            }
                          >
                            Скрыть
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => setProjectToDelete(project)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : null}
      </section>

      <Modal
        isOpen={Boolean(projectToDelete)}
        title="Удалить проект?"
        description="Проект будет удалён без возможности восстановления."
        onClose={() => setProjectToDelete(null)}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setProjectToDelete(null)}
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={isDeleting}
              onClick={confirmDelete}
            >
              Удалить
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">{projectToDelete?.name}</p>
      </Modal>
    </div>
  );
}
