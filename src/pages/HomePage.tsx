import { useSearchParams } from 'react-router-dom';
import type { ProjectCategory } from '@/entities/project/model/types';
import { useGetProjectsQuery } from '@/features/projects/api/projectsApi';
import { ProjectFilters } from '@/features/projects/ui/ProjectFilters';
import { env } from '@/shared/config/env';
import { normalizeProjectCategory } from '@/shared/constants/categories';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { usePageTitle } from '@/shared/lib/pageTitle';
import { Button } from '@/shared/ui/Button';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Pagination } from '@/shared/ui/Pagination';
import { FeaturedSection } from '@/widgets/FeaturedSection';
import { ProjectGrid } from '@/widgets/ProjectGrid';

const parseTags = (value: string | null) =>
  value
    ? value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

export default function HomePage() {
  usePageTitle('Каталог проектов');
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const rawCategory = searchParams.get('category') || '';
  const category = rawCategory ? normalizeProjectCategory(rawCategory) : '';
  const tags = parseTags(searchParams.get('tags'));

  const { data, isLoading, isFetching, error, refetch } = useGetProjectsQuery({
    page,
    limit: env.defaultPageLimit,
    category: category || undefined,
    tags,
  });

  const items = data?.items || [];
  const featuredProjects = items.filter((project) => project.is_featured);
  const regularProjects = items.filter((project) => !project.is_featured);

  const updateParams = (next: {
    page?: number;
    category?: ProjectCategory | '';
    tags?: string[];
  }) => {
    const params = new URLSearchParams(searchParams);
    const nextPage = next.page || 1;
    params.set('page', String(nextPage));

    if ('category' in next) {
      if (next.category) {
        params.set('category', next.category);
      } else {
        params.delete('category');
      }
    }

    if ('tags' in next) {
      if (next.tags?.length) {
        params.set('tags', next.tags.join(','));
      } else {
        params.delete('tags');
      }
    }

    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-normal text-gray-950">
          Каталог vibe-coding проектов
        </h1>
        <p className="text-base leading-7 text-gray-600">
          LaunchSlab собирает indie, AI, инструменты, ботов, игры и
          веб-сервисы. Добавляйте проекты, ведите кабинет автора и запускайте
          featured-продвижение через backend checkout.
        </p>
      </section>

      <ProjectFilters
        category={category}
        tags={tags}
        onChange={(filters) =>
          updateParams({
            page: 1,
            category: filters.category,
            tags: filters.tags,
          })
        }
      />

      {error ? (
        <ErrorState
          description={getApiErrorMessage(error)}
          action={
            <Button type="button" variant="secondary" onClick={() => refetch()}>
              Повторить
            </Button>
          }
        />
      ) : null}

      <FeaturedSection projects={featuredProjects} />

      <section className="space-y-4" aria-labelledby="projects-title">
        <div>
          <h2 id="projects-title" className="text-2xl font-semibold text-gray-950">
            Все проекты
          </h2>
          {isFetching && !isLoading ? (
            <p className="mt-1 text-sm text-gray-500">Обновляем список</p>
          ) : null}
        </div>
        <ProjectGrid
          projects={regularProjects}
          isLoading={isLoading}
          emptyText={
            category || tags.length
              ? 'По выбранным фильтрам ничего не найдено.'
              : 'Пока проектов нет. Кто-то должен быть первым.'
          }
        />
      </section>

      {data && data.total > data.limit ? (
        <Pagination
          page={data.page}
          total={data.total}
          limit={data.limit}
          onPageChange={(nextPage) => updateParams({ page: nextPage })}
        />
      ) : null}
    </div>
  );
}
