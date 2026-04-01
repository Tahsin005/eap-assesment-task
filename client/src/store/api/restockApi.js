import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const restockApi = createApi({
  reducerPath: "restockApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/restock-queue`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["RestockQueue"],
  endpoints: (builder) => ({
    getRestockQueue: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["RestockQueue"],
    }),
    removeFromRestockQueue: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RestockQueue"],
    }),
  }),
});

export const {
  useGetRestockQueueQuery,
  useRemoveFromRestockQueueMutation,
} = restockApi;
