import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { StaffSearchQuery } from "~/types/requests"
import type { ApiResponse, StaffsApi } from "~/types/responses"
import { axiosClient } from "~/utils/axios"
import { API_ADMIN_STAFF_CREATE, API_ADMIN_STAFF_LIST, API_ADMIN_STAFF_DELETE } from "~/utils/endpoints"

import type { CreateStaffData } from "~/validation/staff"

export const staffService = {
  createStaff: async (data: CreateStaffData) => await axiosClient.post(API_ADMIN_STAFF_CREATE, data)
}

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
        data: data,
        method: "POST"
      }),
      invalidatesTags: ["Staffs"]
    }),
    deleteStaff: build.mutation<ApiResponse, string>({
      query: (id) => ({
        url: `${API_ADMIN_STAFF_DELETE}/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Staffs"]
    })
  })
})

export const { useGetAllStaffQuery, useCreateStaffMutation, useDeleteStaffMutation } = staffServiceApi
