import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { DashboardChartApi, DashboardCountApi, DashboardRecentApi } from "~/types/dashboard.type"
import { API_ADMIN_DASHBOARD_CHART, API_ADMIN_DASHBOARD_COUNT, API_ADMIN_DASHBOARD_RECENT } from "~/utils/endpoints"

export const dashboardServiceApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Dashboard"],
  endpoints: (build) => ({
    getDashboardCount: build.query<DashboardCountApi, void>({
      query: () => ({
        url: API_ADMIN_DASHBOARD_COUNT,
        method: "GET"
      }),
      providesTags: ["Dashboard"]
    }),

    getDashboardChart: build.query<DashboardChartApi, void>({
      query: () => ({
        url: API_ADMIN_DASHBOARD_CHART,
        method: "GET"
      }),
      providesTags: ["Dashboard"]
    }),

    getDashboardRecent: build.query<DashboardRecentApi, void>({
      query: () => ({
        url: API_ADMIN_DASHBOARD_RECENT,
        method: "GET"
      }),
      providesTags: ["Dashboard"]
    })
  })
})

export const { useGetDashboardCountQuery, useGetDashboardChartQuery, useGetDashboardRecentQuery } = dashboardServiceApi
