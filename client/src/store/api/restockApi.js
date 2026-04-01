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
    updateRestockPriority: builder.mutation({
      query: ({ id, priority }) => ({
        url: `/${id}/priority`,
        method: "PATCH",
        body: { priority },
      }),
      invalidatesTags: ["RestockQueue"],
    }),
    removeFromRestockQueue: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RestockQueue"],
    }),
    addToRestockQueue: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RestockQueue"],
    }),
  }),
});

export const {
  useGetRestockQueueQuery,
  useUpdateRestockPriorityMutation,
  useRemoveFromRestockQueueMutation,
  useAddToRestockQueueMutation,
} = restockApi;
