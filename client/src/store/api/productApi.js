import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/products`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Product", "ProductMovements"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getProductMovements: builder.query({
      query: ({ id, page = 1, limit = 10 }) => `/${id}/stock-movements?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: "ProductMovements", id }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => ["Products", { type: "Product", id }],
    }),
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ["Products", { type: "Product", id }],
    }),
    adjustStock: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/stock`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products", 
        { type: "Product", id },
        { type: "ProductMovements", id }
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateStatusMutation,
  useAdjustStockMutation,
  useGetProductMovementsQuery,
  useDeleteProductMutation,
} = productApi;
