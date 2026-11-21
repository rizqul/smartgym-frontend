import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { CheckinListApi, CheckinSummaryApi, CheckinTokenApi } from "~/types/checkin"
import { API_ADMIN_CHECKIN_LIST, API_ADMIN_CHECKIN_QR_TOKEN, API_ADMIN_CHECKIN_SUMMARY } from "~/utils/endpoints"

export const checkinServiceApi = createApi({
  reducerPath: "checkinApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Checkins", "CheckinSummary"],
  endpoints: (build) => ({
    getRecentCheckins: build.query<CheckinListApi, number | void>({
      query: (limit = 5) => ({
        url: API_ADMIN_CHECKIN_LIST,
        method: "GET",
        params: { limit }
      }),
      providesTags: ["Checkins"]
    }),
    getCheckinSummary: build.query<CheckinSummaryApi, void>({
      query: () => ({
        url: API_ADMIN_CHECKIN_SUMMARY,
        method: "GET"
      }),
      providesTags: ["CheckinSummary"]
    }),
    generateQrToken: build.mutation<CheckinTokenApi, void>({
      query: () => ({
        url: API_ADMIN_CHECKIN_QR_TOKEN,
        method: "POST"
      })
    })
  })
})

export const { useGetRecentCheckinsQuery, useGetCheckinSummaryQuery, useGenerateQrTokenMutation } = checkinServiceApi
