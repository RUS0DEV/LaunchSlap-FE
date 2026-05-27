import type { Project } from '@/entities/project/model/types';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';

interface FeaturedSectionProps {
  projects: Project[];
}

export function FeaturedSection({ projects }: FeaturedSectionProps) {
  if (!projects.length) {
    return null;
  }

  return (
    <section className="space-y-4" aria-labelledby="featured-title">
      <div>
        <h2 id="featured-title" className="text-2xl font-semibold text-gray-950">
          Featured
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Проекты с активным продвижением.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
