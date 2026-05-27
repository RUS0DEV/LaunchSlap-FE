import { baseApi } from '@/shared/api/baseApi';
import type { Project } from '@/entities/project/model/types';
import type {
  Promotion,
  PromotionType,
} from '@/entities/promotion/model/types';

export interface AdminProjectParams {
  page?: number;
  limit?: number;
  status?: 'all' | 'hidden' | 'visible';
}

export interface AdminProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAdminPromotionDto {
  project_id: string;
  type: PromotionType;
  starts_at: string;
  ends_at?: string;
}

export interface AdminSettings {
  max_featured_slots: number;
}

export interface UpdateAdminSettingsDto {
  max_featured_slots: number;
}

export interface AdminStats {
  projects_count: number;
  active_promotions_count: number;
  revenue_total: number;
}

type RawAdminProjectListResponse =
  | AdminProjectListResponse
  | Project[]
  | {
      data?: Project[];
      items?: Project[];
      total?: number;
      page?: number;
      limit?: number;
    };

const normalizeAdminProjects = (
  response: RawAdminProjectListResponse,
  params: AdminProjectParams | void,
): AdminProjectListResponse => {
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      page: params?.page || 1,
      limit: params?.limit || 20,
    };
  }

  const normalized = response as {
    items?: Project[];
    data?: Project[];
    total?: number;
    page?: number;
    limit?: number;
  };
  const items = normalized.items || normalized.data || [];

  return {
    items,
    total: normalized.total ?? items.length,
    page: normalized.page ?? params?.page ?? 1,
    limit: normalized.limit ?? params?.limit ?? 20,
  };
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProjects: builder.query<
      AdminProjectListResponse,
      AdminProjectParams | void
    >({
      query: (params) => ({
        url: '/admin/projects',
        params: params || undefined,
      }),
      transformResponse: (
        response: RawAdminProjectListResponse,
        _meta,
        arg,
      ) => normalizeAdminProjects(response, arg),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((project) => ({
                type: 'AdminProject' as const,
                id: project.id,
              })),
              { type: 'AdminProject' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminProject' as const, id: 'LIST' }],
    }),
    hideProject: builder.mutation<Project, string>({
      query: (id) => ({
        url: `/admin/projects/${id}/hide`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        { type: 'AdminProject', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    showProject: builder.mutation<Project, string>({
      query: (id) => ({
        url: `/admin/projects/${id}/show`,
        method: 'PATCH',
      }),
      invalidatesTags: [
        { type: 'AdminProject', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    deleteAdminProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'AdminProject', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    getAdminPromotions: builder.query<Promotion[], void>({
      query: () => '/admin/promotions',
      providesTags: (result) =>
        result
          ? [
              ...result.map((promotion) => ({
                type: 'AdminPromotion' as const,
                id: promotion.id,
              })),
              { type: 'AdminPromotion' as const, id: 'LIST' },
            ]
          : [{ type: 'AdminPromotion' as const, id: 'LIST' }],
    }),
    createAdminPromotion: builder.mutation<Promotion, CreateAdminPromotionDto>({
      query: (body) => ({
        url: '/admin/promotions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'AdminPromotion', id: 'LIST' },
        { type: 'AdminProject', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    deleteAdminPromotion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/promotions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'AdminPromotion', id: 'LIST' },
        { type: 'AdminProject', id: 'LIST' },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    getAdminSettings: builder.query<AdminSettings, void>({
      query: () => '/admin/settings',
      providesTags: ['AdminSettings'],
    }),
    updateAdminSettings: builder.mutation<
      AdminSettings,
      UpdateAdminSettingsDto
    >({
      query: (body) => ({
        url: '/admin/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminSettings'],
    }),
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
  }),
});

export const {
  useGetAdminProjectsQuery,
  useHideProjectMutation,
  useShowProjectMutation,
  useDeleteAdminProjectMutation,
  useGetAdminPromotionsQuery,
  useCreateAdminPromotionMutation,
  useDeleteAdminPromotionMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetAdminStatsQuery,
} = adminApi;
