import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common"
import type { MembershipPackagesApi } from "~/types/membership"
import {
  API_ADMIN_MEMBERSHIP_PACKAGE_CREATE,
  API_ADMIN_MEMBERSHIP_PACKAGE_DELETE,
  API_ADMIN_MEMBERSHIP_PACKAGE_LIST,
  API_STAFF_MEMBERSHIP_PACKAGE_LIST
} from "~/utils/endpoints"
import type { CreateMembershipPackageData } from "~/validation/membership"

export const membershipPackageServiceApi = createApi({
  reducerPath: "membershipPackageApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["MembershipPackages"],
  endpoints: (build) => ({
    getAllMembershipPackages: build.query<MembershipPackagesApi, void>({
      query: () => ({
        url: (isStaff) => (isStaff ? API_STAFF_MEMBERSHIP_PACKAGE_LIST : API_ADMIN_MEMBERSHIP_PACKAGE_LIST),
        method: "GET"
      }),
      providesTags: ["MembershipPackages"]
    }),
    createMembershipPackage: build.mutation<ApiResponse, CreateMembershipPackageData>({
      query: (data) => ({
        url: API_ADMIN_MEMBERSHIP_PACKAGE_CREATE,
        data,
        method: "POST"
      }),
      invalidatesTags: ["MembershipPackages"]
    }),
    deleteMembershipPackage: build.mutation<ApiResponse, string>({
      query: (id) => ({
        url: API_ADMIN_MEMBERSHIP_PACKAGE_DELETE(id),
        method: "DELETE"
      }),
      invalidatesTags: ["MembershipPackages"]
    })
  })
})

export const { useGetAllMembershipPackagesQuery, useCreateMembershipPackageMutation, useDeleteMembershipPackageMutation } =
  membershipPackageServiceApi
