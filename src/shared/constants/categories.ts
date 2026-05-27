import type { ProjectCategory } from '@/entities/project/model/types';

export const categoryLabels: Record<ProjectCategory, string> = {
  saas: 'SaaS',
  web_app: 'Веб-приложение',
  mobile_app: 'Мобильное приложение',
  ai_tool: 'Инструменты',
  ecommerce: 'E-commerce',
  education: 'Образование',
  other: 'Прочее',
};

const ruCategoryMap: Record<string, ProjectCategory> = {
  tools: 'ai_tool',
  games: 'web_app',
  bots: 'ai_tool',
  web_services: 'web_app',
  api_libraries: 'saas',
  инструменты: 'ai_tool',
  игры: 'web_app',
  боты: 'ai_tool',
  'веб-сервисы': 'web_app',
  веб_сервисы: 'web_app',
  'api / библиотеки': 'saas',
  'api библиотеки': 'saas',
  образование: 'education',
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
