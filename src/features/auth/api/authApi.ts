import { baseApi } from '@/shared/api/baseApi';
import type { User } from '@/entities/user/model/types';

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user?: User;
}

type UserEnvelope = User | { user?: User };
type AuthEnvelope =
  | AuthResponse
  | { token?: string; access_token?: string; user?: UserEnvelope };

const normalizeUser = (response: UserEnvelope): User => {
  if ('user' in response && response.user) {
    return response.user;
  }

  return response as User;
};

const normalizeAuthResponse = (response: AuthEnvelope): AuthResponse => ({
  token: response.token,
  access_token: response.access_token,
  user: response.user ? normalizeUser(response.user) : undefined,
});

export const getAuthToken = (response: AuthResponse) =>
  response.token || response.access_token || '';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: normalizeAuthResponse,
    }),
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: normalizeAuthResponse,
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    confirmEmail: builder.query<void, string>({
      query: (token) => `/auth/confirm/${token}`,
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordDto>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordDto>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: normalizeUser,
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useConfirmEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
