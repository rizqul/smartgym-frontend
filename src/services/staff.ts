import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common"
import type { StaffsApi, StaffSearchQuery, UpdateStaffPayload } from "~/types/user"
import { API_ADMIN_STAFF_CREATE, API_ADMIN_STAFF_DELETE, API_ADMIN_STAFF_LIST, API_ADMIN_STAFF_UPDATE } from "~/utils/endpoints"
import type { CreateStaffData } from "~/validation/staff"

export const staffServiceApi = createApi({
  reducerPath: "staffApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Staffs"],
  endpoints: (build) => ({
    getAllStaff: build.query<StaffsApi, StaffSearchQuery>({
      query: ({ name = "", size = 10, page = 1 }) => ({
        url: API_ADMIN_STAFF_LIST,
        method: "GET",
        params: {
          name,
          size,
          page
        }
      }),
      providesTags: ["Staffs"]
    }),
    createStaff: build.mutation<ApiResponse, CreateStaffData>({
      query: (data) => ({
        url: API_ADMIN_STAFF_CREATE,
        method: "POST",
        data
      }),
      invalidatesTags: ["Staffs"]
    }),
    updateStaff: build.mutation<ApiResponse, UpdateStaffPayload>({
      query: ({ id, ...body }) => ({
        url: API_ADMIN_STAFF_UPDATE(id),
        method: "PUT",
        data: body
      }),
      invalidatesTags: ["Staffs"]
    }),
    deleteStaff: build.mutation<ApiResponse, string>({
      query: (id) => ({
        url: API_ADMIN_STAFF_DELETE(id),
        method: "DELETE"
      }),
      invalidatesTags: ["Staffs"]
    })
  })
})

export const { useGetAllStaffQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation } = staffServiceApi
