import { baseApi } from '@/shared/api/baseApi';
import type {
  Promotion,
  PromotionType,
} from '@/entities/promotion/model/types';

export interface CreateCheckoutDto {
  project_id: string;
  type: PromotionType;
}

export interface CheckoutResponse {
  redirect_url: string;
}

export const promotionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation<CheckoutResponse, CreateCheckoutDto>({
      query: (body) => ({
        url: '/promotions/checkout',
        method: 'POST',
        body,
      }),
    }),
    getMyPromotions: builder.query<Promotion[], void>({
      query: () => '/promotions/my',
      providesTags: (result) =>
        result
          ? [
              ...result.map((promotion) => ({
                type: 'Promotion' as const,
                id: promotion.id,
              })),
              { type: 'Promotion' as const, id: 'LIST' },
            ]
          : [{ type: 'Promotion' as const, id: 'LIST' }],
    }),
  }),
});

export const { useCreateCheckoutMutation, useGetMyPromotionsQuery } =
  promotionsApi;
