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
      pagination?: {
        total?: number;
        page?: number;
        limit?: number;
      };
      total?: number;
      page?: number;
      limit?: number;
    };

type RawProject = Project & {
  userId?: string;
  user?: { email?: string };
  imageUrl?: string | null;
  isHidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
  promotions?: Project['active_promotion'][];
};

type RawProjectEnvelope =
  | Project
  | RawProject
  | { project?: Project | RawProject };

export const normalizeProject = (response: RawProjectEnvelope): Project => {
  const project =
    'project' in response && response.project ? response.project : response;
  const raw = project as RawProject;
  const activePromotion = raw.active_promotion ?? raw.promotions?.[0] ?? null;

  return {
    ...raw,
    user_id: raw.user_id ?? raw.userId ?? '',
    user_email: raw.user_email ?? raw.user?.email,
    image_url: raw.image_url ?? raw.imageUrl ?? '',
    is_hidden: raw.is_hidden ?? raw.isHidden ?? false,
    created_at: raw.created_at ?? raw.createdAt ?? '',
    updated_at: raw.updated_at ?? raw.updatedAt ?? '',
    is_featured: raw.is_featured ?? Boolean(activePromotion),
    active_promotion: activePromotion,
  };
};

const normalizeProjectArray = (projects: (Project | RawProject)[]) =>
  projects.map((project) => normalizeProject(project));

const normalizeProjectList = (
  response: RawProjectListResponse,
  params: ProjectListParams | void,
): ProjectListResponse => {
  if (Array.isArray(response)) {
    const items = normalizeProjectArray(response);

    return {
      items,
      total: items.length,
      page: params?.page || 1,
      limit: params?.limit || env.defaultPageLimit,
    };
  }

  const normalized = response as {
    items?: (Project | RawProject)[];
    data?: (Project | RawProject)[];
    pagination?: {
      total?: number;
      page?: number;
      limit?: number;
    };
    total?: number;
    page?: number;
    limit?: number;
  };
  const items = normalizeProjectArray(normalized.items || normalized.data || []);

  return {
    items,
    total: normalized.total ?? normalized.pagination?.total ?? items.length,
    page: normalized.page ?? normalized.pagination?.page ?? params?.page ?? 1,
    limit:
      normalized.limit ??
      normalized.pagination?.limit ??
      params?.limit ??
      env.defaultPageLimit,
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
      transformResponse: normalizeProject,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      transformResponse: normalizeProject,
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
      transformResponse: normalizeProject,
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
      transformResponse: (response: RawProjectEnvelope) => {
        const project = normalizeProject(response);
        return { image_url: project.image_url };
      },
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: 'Project', id: projectId },
        { type: 'UserProject', id: 'LIST' },
      ],
    }),
    getUserProjects: builder.query<Project[], void>({
      query: () => '/user/projects',
      transformResponse: (
        response: Project[] | { data?: (Project | RawProject)[] },
      ) =>
        normalizeProjectArray(
          Array.isArray(response) ? response : response.data || [],
        ),
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
