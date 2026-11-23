import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common"
import type {
  CreateTrainerSlotRequest,
  GetTrainerSlotsParams,
  TrainerCountApi,
  TrainersApi,
  TrainerSearchQuery,
  TrainerSlotsApi
} from "~/types/trainer"
import {
  API_ADMIN_TRAINERS_COUNT,
  API_ADMIN_TRAINERS_CREATE,
  API_ADMIN_TRAINERS_LIST,
  API_ADMIN_TRAINERS_SLOT_CREATE,
  API_ADMIN_TRAINERS_SLOT_LIST,
  API_STAFF_TRAINERS_COUNT,
  API_STAFF_TRAINERS_LIST,
  API_STAFF_TRAINERS_SLOT_LIST
} from "~/utils/endpoints"
import type { CreateTrainerData } from "~/validation/trainer"

export const trainerServiceApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Trainers", "TrainerSlots", "TrainerCount"],
  endpoints: (build) => ({
    getAllTrainer: build.query<TrainersApi, TrainerSearchQuery>({
      query: ({ name = "", size = 10, page = 1 }) => ({
        url: (isStaff) => (isStaff ? API_STAFF_TRAINERS_LIST : API_ADMIN_TRAINERS_LIST),
        method: "GET",
        params: {
          name,
          size,
          page
        }
      }),
      providesTags: ["Trainers"]
    }),
    createTrainer: build.mutation<ApiResponse, CreateTrainerData>({
      query: (data) => ({
        url: API_ADMIN_TRAINERS_CREATE,
        data,
        method: "POST"
      }),
      invalidatesTags: ["Trainers", "TrainerCount"]
    }),
    getTrainerSlots: build.query<TrainerSlotsApi, GetTrainerSlotsParams>({
      query: ({ trainerId, date }) => ({
        url: (isStaff) => (isStaff ? API_STAFF_TRAINERS_SLOT_LIST(trainerId) : API_ADMIN_TRAINERS_SLOT_LIST(trainerId)),
        method: "GET",
        params: date ? { date } : undefined
      }),
      providesTags: (_result, _error, { trainerId }) => [{ type: "TrainerSlots", id: trainerId }]
    }),
    createTrainerSlot: build.mutation<ApiResponse, CreateTrainerSlotRequest>({
      query: ({ trainerId, ...data }) => ({
        url: API_ADMIN_TRAINERS_SLOT_CREATE(trainerId),
        method: "POST",
        data
      }),
      invalidatesTags: (_result, _error, { trainerId }) => [{ type: "TrainerSlots", id: trainerId }, "TrainerCount"]
    }),
    getTrainerCount: build.query<TrainerCountApi, void>({
      query: () => ({
        url: (isStaff) => (isStaff ? API_STAFF_TRAINERS_COUNT : API_ADMIN_TRAINERS_COUNT),
        method: "GET"
      }),
      providesTags: ["TrainerCount"]
    })
  })
})

export const {
  useGetAllTrainerQuery,
  useCreateTrainerMutation,
  useGetTrainerSlotsQuery,
  useCreateTrainerSlotMutation,
  useGetTrainerCountQuery
} = trainerServiceApi
