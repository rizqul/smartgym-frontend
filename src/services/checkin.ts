import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"

import type { CheckinDetailApi, CheckinListApi, CheckinSummaryApi, CheckinTokenApi } from "~/types/checkin"
import {
  API_ADMIN_CHECKIN_CHECKOUT,
  API_ADMIN_CHECKIN_LIST,
  API_ADMIN_CHECKIN_QR_TOKEN,
  API_ADMIN_CHECKIN_SUMMARY,
  API_STAFF_CHECKIN_CHECKOUT,
  API_STAFF_CHECKIN_QR_TOKEN
} from "~/utils/endpoints"

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
        url: (isStaff) => (isStaff ? API_STAFF_CHECKIN_QR_TOKEN : API_ADMIN_CHECKIN_QR_TOKEN),
        method: "POST"
      })
    }),
    checkOutMember: build.mutation<CheckinDetailApi, string>({
      query: (memberId) => ({
        url: (isStaff) => (isStaff ? API_STAFF_CHECKIN_CHECKOUT(memberId) : API_ADMIN_CHECKIN_CHECKOUT(memberId)),
        method: "POST"
      }),
      invalidatesTags: ["Checkins", "CheckinSummary"]
    })
  })
})

export const { useGetRecentCheckinsQuery, useGetCheckinSummaryQuery, useGenerateQrTokenMutation, useCheckOutMemberMutation } =
  checkinServiceApi
