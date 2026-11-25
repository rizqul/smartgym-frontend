import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { ApiResponse } from "~/types/common.type"
import type {
  CreateTrainerSlotApi,
  CreateTrainerSlotRequest,
  GetTrainerSlotsParams,
  TrainerBookingsApi,
  TrainerBookingSearchQuery,
  TrainerCountApi,
  TrainersApi,
  TrainerSearchQuery,
  TrainerSlotsApi
} from "~/types/trainer.type"
import {
  API_ADMIN_TRAINERS_BOOKING_LIST,
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
    getAllTrainer: build.query<TrainersApi, TrainerSearchQuery | void>({
      query: (arg) => {
        const { search, size = 10, page = 1 } = arg ?? {}
        const trimmedSearch = search?.trim()

        return {
          url: (isStaff) => (isStaff ? API_STAFF_TRAINERS_LIST : API_ADMIN_TRAINERS_LIST),
          method: "GET",
          params: {
            size,
            page,
            ...(trimmedSearch ? { search: trimmedSearch } : {})
          }
        }
      },
      providesTags: (result) =>
        result?.data
          ? [...result.data.map(({ id }) => ({ type: "Trainers" as const, id })), { type: "Trainers", id: "LIST" }]
          : [{ type: "Trainers", id: "LIST" }]
    }),

    createTrainer: build.mutation<ApiResponse, CreateTrainerData | FormData>({
      query: (body) => ({
        url: API_ADMIN_TRAINERS_CREATE,
        method: "POST",
        data: body
      }),
      invalidatesTags: [{ type: "Trainers", id: "LIST" }, "TrainerCount"]
    }),

    getTrainerCount: build.query<TrainerCountApi, void>({
      query: () => ({
        url: (isStaff) => (isStaff ? API_STAFF_TRAINERS_COUNT : API_ADMIN_TRAINERS_COUNT),
        method: "GET"
      }),
      providesTags: ["TrainerCount"]
    }),

    getTrainerSlots: build.query<TrainerSlotsApi, GetTrainerSlotsParams>({
      query: ({ trainerId, date }) => ({
        url: (isStaff) => (isStaff ? API_STAFF_TRAINERS_SLOT_LIST(trainerId) : API_ADMIN_TRAINERS_SLOT_LIST(trainerId)),
        method: "GET",
        params: {
          ...(date ? { date } : {})
        }
      }),
      providesTags: (_result, _error, { trainerId, date }) => [
        { type: "TrainerSlots", id: trainerId },
        { type: "TrainerSlots", id: `${trainerId}-${date ?? "today"}` }
      ]
    }),

    createTrainerSlot: build.mutation<CreateTrainerSlotApi, CreateTrainerSlotRequest>({
      query: ({ trainerId, ...data }) => ({
        url: API_ADMIN_TRAINERS_SLOT_CREATE(trainerId),
        method: "POST",
        data
      }),
      invalidatesTags: (_result, _error, { trainerId }) => [{ type: "TrainerSlots", id: trainerId }, "TrainerCount"]
    }),

    getTrainerBookings: build.query<TrainerBookingsApi, TrainerBookingSearchQuery | void>({
      query: (params) => ({
        url: API_ADMIN_TRAINERS_BOOKING_LIST,
        method: "GET",
        params: {
          size: params?.size ?? 100,
          page: params?.page ?? 1,
          ...(params?.trainerId ? { trainerId: params.trainerId } : {}),
          ...(params?.date ? { date: params.date } : {})
        }
      }),
      providesTags: ["Trainers", "TrainerSlots"]
    })
  })
})

export const {
  useGetAllTrainerQuery,
  useCreateTrainerMutation,
  useGetTrainerSlotsQuery,
  useCreateTrainerSlotMutation,
  useGetTrainerCountQuery,
  useGetTrainerBookingsQuery
} = trainerServiceApi
