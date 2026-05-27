import { ExternalLink, Pencil, Rocket, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '@/entities/project/model/types';
import { getCategoryLabel } from '@/shared/constants/categories';
import { formatDate } from '@/shared/lib/formatDate';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

interface ProjectCardProps {
  project: Project;
  variant?: 'catalog' | 'dashboard' | 'admin';
  onDelete?: (project: Project) => void;
  onPromote?: (project: Project) => void;
  onHide?: (project: Project) => void;
  onShow?: (project: Project) => void;
}

const truncate = (value: string, limit = 150) =>
  value.length > limit ? `${value.slice(0, limit).trim()}...` : value;

export function ProjectCard({
  project,
  variant = 'catalog',
  onDelete,
  onPromote,
  onHide,
  onShow,
}: ProjectCardProps) {
  const statusTone = project.is_hidden ? 'danger' : 'success';

  return (
    <Card
      className={
        project.is_featured
          ? 'border-indigo-300 shadow-md'
          : 'border-gray-200 shadow-sm'
      }
    >
      <Link
        to={`/projects/${project.id}`}
        className="block overflow-hidden rounded-t-lg bg-gray-100"
        aria-label={`Открыть проект ${project.name}`}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            loading="lazy"
            className="h-44 w-full object-cover"
          />
        ) : (
          <div className="flex h-44 items-center justify-center text-sm text-gray-500">
            Нет изображения
          </div>
        )}
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge>{getCategoryLabel(project.category)}</Badge>
          {project.is_featured ? <Badge tone="featured">Featured</Badge> : null}
          {variant !== 'catalog' ? (
            <Badge tone={statusTone}>
              {project.is_hidden ? 'Скрыт' : 'Опубликован'}
            </Badge>
          ) : null}
        </div>
        <div>
          <Link
            to={`/projects/${project.id}`}
            className="text-lg font-semibold text-gray-900 hover:underline"
          >
            {project.name}
          </Link>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {variant === 'catalog'
              ? truncate(project.description)
              : project.description}
          </p>
        </div>
        {project.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        {variant !== 'catalog' ? (
          <p className="text-xs text-gray-500">
            Добавлен: {formatDate(project.created_at)}
          </p>
        ) : null}
        {variant === 'catalog' ? (
          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline"
          >
            Подробнее
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
        {variant === 'dashboard' ? (
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/dashboard/projects/${project.id}/edit`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Редактировать
            </Link>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={project.is_hidden}
              onClick={() => onPromote?.(project)}
              leftIcon={<Rocket className="h-4 w-4" aria-hidden="true" />}
            >
              Продвинуть
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete?.(project)}
              leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
            >
              Удалить
            </Button>
          </div>
        ) : null}
        {variant === 'admin' ? (
          <div className="flex flex-wrap gap-2">
            {project.is_hidden ? (
              <Button type="button" size="sm" onClick={() => onShow?.(project)}>
                Показать
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onHide?.(project)}
              >
                Скрыть
              </Button>
            )}
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete?.(project)}
              leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
            >
              Удалить
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
