import { baseApi } from '@/shared/api/baseApi';
import type { Payment } from '@/entities/payment/model/types';

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserPayments: builder.query<Payment[], void>({
      query: () => '/user/payments',
      providesTags: (result) =>
        result
          ? [
              ...result.map((payment) => ({
                type: 'Payment' as const,
                id: payment.id,
              })),
              { type: 'Payment' as const, id: 'LIST' },
            ]
          : [{ type: 'Payment' as const, id: 'LIST' }],
    }),
  }),
});

export const { useGetUserPaymentsQuery } = paymentsApi;
