import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common"
import type { MembersApi, MemberSearchQuery } from "~/types/user"
import {
  API_ADMIN_MEMBERS_CREATE,
  API_ADMIN_MEMBERS_DELETE,
  API_ADMIN_MEMBERS_LIST,
  API_ADMIN_MEMBERS_OTP,
  API_STAFF_MEMBERS_CREATE,
  API_STAFF_MEMBERS_DELETE,
  API_STAFF_MEMBERS_LIST,
  API_STAFF_MEMBERS_OTP
} from "~/utils/endpoints"
import type { CreateMemberData } from "~/validation/member"

export const memberServiceApi = createApi({
  reducerPath: "memberApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Members"],
  endpoints: (build) => ({
    getAllMember: build.query<MembersApi, MemberSearchQuery>({
      query: ({ name = "", size = 10, page = 1 }) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_LIST : API_ADMIN_MEMBERS_LIST),
        method: "GET",
        params: {
          name,
          size,
          page
        }
      }),
      providesTags: ["Members"]
    }),

    requestMemberOtp: build.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_OTP : API_ADMIN_MEMBERS_OTP),
        method: "POST",
        data
      })
    }),

    createMember: build.mutation<ApiResponse, CreateMemberData>({
      query: (data) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_CREATE : API_ADMIN_MEMBERS_CREATE),
        method: "POST",
        data
      }),
      invalidatesTags: ["Members"]
    }),

    deleteMember: build.mutation<ApiResponse, string>({
      query: (id) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_DELETE(id) : `${API_ADMIN_MEMBERS_DELETE}/${id}`),
        method: "DELETE"
      }),
      invalidatesTags: ["Members"]
    })
  })
})

export const { useGetAllMemberQuery, useRequestMemberOtpMutation, useCreateMemberMutation, useDeleteMemberMutation } = memberServiceApi
