import type { ProjectCategory } from '@/entities/project/model/types';

export const categoryLabels: Record<ProjectCategory, string> = {
  tools: 'Инструменты',
  games: 'Игры',
  bots: 'Боты',
  web_services: 'Веб-сервисы',
  api_libraries: 'API / библиотеки',
  other: 'Прочее',
};

const ruCategoryMap: Record<string, ProjectCategory> = {
  инструменты: 'tools',
  игры: 'games',
  боты: 'bots',
  'веб-сервисы': 'web_services',
  веб_сервисы: 'web_services',
  'api / библиотеки': 'api_libraries',
  'api библиотеки': 'api_libraries',
  прочее: 'other',
};

export const categoryOptions = Object.entries(categoryLabels).map(
  ([value, label]) => ({
    value: value as ProjectCategory,
    label,
  }),
);

export function normalizeProjectCategory(value: string): ProjectCategory {
  if (value in categoryLabels) {
    return value as ProjectCategory;
  }

  return ruCategoryMap[value.trim().toLowerCase()] || 'other';
}

export function getCategoryLabel(value?: string | null) {
  if (!value) {
    return 'Прочее';
  }

  return categoryLabels[normalizeProjectCategory(value)];
}
