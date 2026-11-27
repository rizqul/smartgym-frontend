import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common.type"
import type { MemberCountApi, MembersApi, MemberSearchQuery, UpdateMemberPayload } from "~/types/user.type"
import {
  API_ADMIN_MEMBERS_COUNT,
  API_ADMIN_MEMBERS_CREATE,
  API_ADMIN_MEMBERS_DELETE,
  API_ADMIN_MEMBERS_LIST,
  API_ADMIN_MEMBERS_OTP,
  API_ADMIN_MEMBERS_UPDATE,
  API_STAFF_MEMBERS_COUNT,
  API_STAFF_MEMBERS_CREATE,
  API_STAFF_MEMBERS_DELETE,
  API_STAFF_MEMBERS_LIST,
  API_STAFF_MEMBERS_OTP,
  API_STAFF_MEMBERS_UPDATE
} from "~/utils/endpoints"
import type { CreateMemberData } from "~/validation/member"

export const memberServiceApi = createApi({
  reducerPath: "memberApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Members"],
  endpoints: (build) => ({
    getAllMember: build.query<MembersApi, MemberSearchQuery>({
      query: ({ search, membership, size = 10, page = 1 }) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_LIST : API_ADMIN_MEMBERS_LIST),
        method: "GET",
        params: {
          size,
          page,
          ...(search ? { search } : {}),
          ...(membership !== undefined ? { membership } : {})
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

    updateMember: build.mutation<ApiResponse, UpdateMemberPayload>({
      query: ({ id, data }) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_UPDATE(id) : API_ADMIN_MEMBERS_UPDATE(id)),
        method: "PUT",
        data
      }),
      invalidatesTags: ["Members"]
    }),

    deleteMember: build.mutation<ApiResponse, string>({
      query: (id) => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_DELETE(id) : API_ADMIN_MEMBERS_DELETE(id)),
        method: "DELETE"
      }),
      invalidatesTags: ["Members"]
    }),

    getMemberCount: build.query<MemberCountApi, void>({
      query: () => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERS_COUNT : API_ADMIN_MEMBERS_COUNT),
        method: "GET"
      }),
      providesTags: ["Members"]
    })
  })
})

export const {
  useGetAllMemberQuery,
  useRequestMemberOtpMutation,
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useGetMemberCountQuery,
  useUpdateMemberMutation
} = memberServiceApi
