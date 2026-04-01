import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/orders`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Orders", "Order"],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ["Orders", { type: "Order", id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => ["Orders", { type: "Order", id }],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrderMovements: builder.query({
      query: ({ id, page = 1, limit = 10 }) => `/${id}/stock-movements?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        data: response.data,
        meta: response.meta
      }),
      providesTags: (result, error, { id }) => [{ type: "Order", id }, "Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
  useGetOrderMovementsQuery,
} = orderApi;
