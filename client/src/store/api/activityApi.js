import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/activities`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Activity"],
  endpoints: (builder) => ({
    getActivities: builder.query({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Activity"],
    }),
  }),
});

export const { useGetActivitiesQuery } = activityApi;
