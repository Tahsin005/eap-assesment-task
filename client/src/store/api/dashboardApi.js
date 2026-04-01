import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: () => "/summary",
      transformResponse: (response) => response.data,
      providesTags: ["Dashboard"],
    }),
    getDailyStats: builder.query({
      query: () => "/orders-today", // In a real app we might combine these or fetch both
      transformResponse: (response) => response.data,
      providesTags: ["Dashboard"],
    }),
    getRevenueToday: builder.query({
      query: () => "/revenue-today",
      transformResponse: (response) => response.data,
      providesTags: ["Dashboard"],
    }),
    getLowStockCount: builder.query({
      query: () => "/low-stock-count",
      transformResponse: (response) => response.data,
      providesTags: ["Dashboard"],
    }),
    getOrderDistribution: builder.query({
      query: () => "/pending-vs-completed",
      transformResponse: (response) => response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetSummaryQuery,
  useGetDailyStatsQuery,
  useGetRevenueTodayQuery,
  useGetLowStockCountQuery,
  useGetOrderDistributionQuery,
} = dashboardApi;
