import type { Project } from '@/entities/project/model/types';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Skeleton } from '@/shared/ui/Skeleton';

interface ProjectGridProps {
  projects: Project[];
  isLoading?: boolean;
  emptyText?: string;
}

export function ProjectGrid({
  projects,
  isLoading,
  emptyText = 'Пока проектов нет. Кто-то должен быть первым.',
}: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-80" />
        ))}
      </div>
    );
  }

  if (!projects.length) {
    return <EmptyState title={emptyText} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
