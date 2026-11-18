import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { MemberSearchQuery } from "~/types/requests"
import type { ApiResponse, MembersApi } from "~/types/responses"
import { axiosClient } from "~/utils/axios"
import { API_ADMIN_MEMBERS_CREATE, API_ADMIN_MEMBERS_DELETE, API_ADMIN_MEMBERS_LIST, API_ADMIN_MEMBERS_OTP } from "~/utils/endpoints"

import type { CreateMemberData } from "~/validation/member"

export const memberService = {
  createMember: async (data: CreateMemberData) => await axiosClient.post(API_ADMIN_MEMBERS_CREATE, data),
  getOtpCode: async (data: { email: string }) => await axiosClient.post(API_ADMIN_MEMBERS_OTP, data)
}

export const memberServiceApi = createApi({
  reducerPath: "memberApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Members"],
  endpoints: (build) => ({
    getAllMember: build.query<MembersApi, MemberSearchQuery>({
      query: ({ name = "", size = 10, page = 1 }) => ({
        url: API_ADMIN_MEMBERS_LIST,
        method: "GET",
        params: {
          name,
          size,
          page
        }
      })
    }),
    createMember: build.mutation<ApiResponse, CreateMemberData>({
      query: (data) => ({
        url: API_ADMIN_MEMBERS_CREATE,
        data: data,
        method: "POST"
      }),
      invalidatesTags: ["Members"]
    }),
    deleteMember: build.mutation<ApiResponse, string>({
      query:(id) => ({
        url: `${API_ADMIN_MEMBERS_DELETE}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Members"]
    })
  })
})

export const { useGetAllMemberQuery, useCreateMemberMutation, useDeleteMemberMutation } = memberServiceApi
