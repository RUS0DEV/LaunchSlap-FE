import { ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetProjectByIdQuery } from '@/features/projects/api/projectsApi';
import { getCategoryLabel } from '@/shared/constants/categories';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/formatDate';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Skeleton } from '@/shared/ui/Skeleton';

export default function ProjectPage() {
  const { id = '' } = useParams();
  const { data: project, isLoading, error } = useGetProjectByIdQuery(id, {
    skip: !id,
  });

  usePageTitle(project?.name || 'Проект');

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-80" />
        <Skeleton className="h-10 max-w-lg" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error || !project || project.is_hidden) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <ErrorState
          title="Проект недоступен"
          description={
            project?.is_hidden
              ? 'Проект скрыт администратором.'
              : getApiErrorMessage(error)
          }
          action={
            <Link className="text-sm font-medium underline" to="/">
              Вернуться в каталог
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="h-80 w-full object-cover"
          />
        ) : (
          <div className="flex h-80 items-center justify-center bg-gray-100 text-gray-500">
            Нет изображения
          </div>
        )}
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{getCategoryLabel(project.category)}</Badge>
            {project.is_featured ? <Badge tone="featured">Featured</Badge> : null}
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-950">
              {project.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Добавлен: {formatDate(project.created_at)}
            </p>
          </div>
          <p className="whitespace-pre-wrap text-base leading-7 text-gray-700">
            {project.description}
          </p>
          {project.tags?.length ? (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          ) : null}
          {project.contact ? (
            <p className="text-sm text-gray-600">Контакт: {project.contact}</p>
          ) : null}
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <Button
              type="button"
              rightIcon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
            >
              Перейти на сайт
            </Button>
          </a>
        </div>
      </Card>
    </div>
  );
}
