import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common.type"
import type { UpdatePasswordRequest, UpdateProfileRequest, UserApi } from "~/types/user.type"

import { API_USER, API_USER_UPDATE_PASSWORD, API_USER_UPDATE_PROFILE } from "~/utils/endpoints"

export const userServiceApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (build) => ({
    getProfile: build.query<UserApi, void>({
      query: () => ({
        url: API_USER,
        method: "GET"
      }),
      providesTags: ["User"]
    }),
    updateProfile: build.mutation<ApiResponse, UpdateProfileRequest | FormData>({
      query: (data) => ({
        url: API_USER_UPDATE_PROFILE,
        data,
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }),
      invalidatesTags: ["User"]
    }),
    updatePassword: build.mutation<ApiResponse, UpdatePasswordRequest>({
      query: (data) => ({
        url: API_USER_UPDATE_PASSWORD,
        data,
        method: "PUT"
      })
    })
  })
})

export const { useGetProfileQuery, useUpdateProfileMutation, useUpdatePasswordMutation } = userServiceApi
