import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { Project } from '@/entities/project/model/types';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';
import {
  useDeleteProjectMutation,
  useGetUserProjectsQuery,
} from '@/features/projects/api/projectsApi';
import { PromoteProjectModal } from '@/features/promotions/ui/PromoteProjectModal';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Modal } from '@/shared/ui/Modal';
import { Skeleton } from '@/shared/ui/Skeleton';
import { DashboardSidebar } from '@/widgets/DashboardSidebar';

export default function DashboardPage() {
  usePageTitle('Личный кабинет');
  const { data: projects = [], isLoading, error } = useGetUserProjectsQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToPromote, setProjectToPromote] = useState<Project | null>(null);

  const handleDelete = async () => {
    if (!projectToDelete) {
      return;
    }

    try {
      await deleteProject(projectToDelete.id).unwrap();
      toast.success('Проект удалён');
      setProjectToDelete(null);
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError));
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr] sm:px-6 lg:px-8">
      <DashboardSidebar />
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-950">
              Мои проекты
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Управление публикациями, удалением и продвижением.
            </p>
          </div>
          <Link
            to="/dashboard/projects/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-900 bg-gray-900 px-4 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Добавить проект
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-96" />
            ))}
          </div>
        ) : null}

        {error ? <ErrorState description={getApiErrorMessage(error)} /> : null}

        {!isLoading && !error && !projects.length ? (
          <EmptyState
            title="У вас пока нет проектов"
            action={
              <Link to="/dashboard/projects/new">
                <Button type="button">Добавить проект</Button>
              </Link>
            }
          />
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="dashboard"
              onDelete={setProjectToDelete}
              onPromote={setProjectToPromote}
            />
          ))}
        </div>
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
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">{projectToDelete?.name}</p>
      </Modal>
      <PromoteProjectModal
        project={projectToPromote}
        isOpen={Boolean(projectToPromote)}
        onClose={() => setProjectToPromote(null)}
      />
    </div>
  );
}
