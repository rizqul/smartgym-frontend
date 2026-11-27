import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ApiResponse } from "~/types/common.type"
import type { MembershipPackagesApi } from "~/types/membership.type"
import type { TrainerItem } from "~/types/trainer.type"
import { API_LANDING_MEMBERSHIP_PACKAGES, API_LANDING_TRAINERS } from "~/utils/endpoints"

export type LandingTrainersApi = ApiResponse & {
  data: TrainerItem[]
}

export const landingServiceApi = createApi({
  reducerPath: "landingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json")
      return headers
    }
  }),
  tagTypes: ["LandingPackages", "LandingTrainers"],
  endpoints: (build) => ({
    getLandingMembershipPackages: build.query<MembershipPackagesApi, void>({
      query: () => API_LANDING_MEMBERSHIP_PACKAGES,
      providesTags: ["LandingPackages"]
    }),
    getLandingTrainers: build.query<LandingTrainersApi, void>({
      query: () => API_LANDING_TRAINERS,
      providesTags: ["LandingTrainers"]
    })
  })
})

export const { useGetLandingMembershipPackagesQuery, useGetLandingTrainersQuery } = landingServiceApi