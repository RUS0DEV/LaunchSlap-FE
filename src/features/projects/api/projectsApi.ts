import { baseApi } from '@/shared/api/baseApi';
import type {
  CreateProjectDto,
  ImageUploadResponse,
  Project,
  ProjectListParams,
  ProjectListResponse,
  UpdateProjectDto,
  UploadImageDto,
} from '@/entities/project/model/types';
import { env } from '@/shared/config/env';

type RawProjectListResponse =
  | ProjectListResponse
  | Project[]
  | {
      data?: Project[];
      items?: Project[];
      total?: number;
      page?: number;
      limit?: number;
    };

const normalizeProjectList = (
  response: RawProjectListResponse,
  params: ProjectListParams | void,
): ProjectListResponse => {
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      page: params?.page || 1,
      limit: params?.limit || env.defaultPageLimit,
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
    limit: normalized.limit ?? params?.limit ?? env.defaultPageLimit,
  };
};

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectListResponse, ProjectListParams | void>({
      query: (params) => ({
        url: '/projects',
        params: {
          page: params?.page || 1,
          limit: params?.limit || env.defaultPageLimit,
          category: params?.category || undefined,
          tags: params?.tags?.length ? params.tags.join(',') : undefined,
        },
      }),
      transformResponse: (response: RawProjectListResponse, _meta, arg) =>
        normalizeProjectList(response, arg),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((project) => ({
                type: 'Project' as const,
                id: project.id,
              })),
              { type: 'Project' as const, id: 'LIST' },
            ]
          : [{ type: 'Project' as const, id: 'LIST' }],
    }),
    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Project', id: 'LIST' },
        { type: 'UserProject', id: 'LIST' },
      ],
    }),
    updateProject: builder.mutation<Project, UpdateProjectDto>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
        { type: 'UserProject', id: 'LIST' },
      ],
    }),
    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Project', id: 'LIST' },
        { type: 'UserProject', id: 'LIST' },
      ],
    }),
    uploadProjectImage: builder.mutation<ImageUploadResponse, UploadImageDto>({
      query: ({ projectId, file }) => {
        const body = new FormData();
        body.append('image', file);

        return {
          url: `/projects/${projectId}/image`,
          method: 'POST',
          body,
        };
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Project', id: projectId },
        { type: 'UserProject', id: 'LIST' },
      ],
    }),
    getUserProjects: builder.query<Project[], void>({
      query: () => '/user/projects',
      providesTags: (result) =>
        result
          ? [
              ...result.map((project) => ({
                type: 'UserProject' as const,
                id: project.id,
              })),
              { type: 'UserProject' as const, id: 'LIST' },
            ]
          : [{ type: 'UserProject' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadProjectImageMutation,
  useGetUserProjectsQuery,
} = projectsApi;
