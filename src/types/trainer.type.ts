import type { ApiResponse, ApiResponsePaginate, PaginationQuery } from "~/types/common.type"

export type TrainerSpecialization =
  | "GENERAL_FITNESS"
  | "WEIGHT_LOSS"
  | "BODYBUILDING"
  | "STRENGTH_CONDITIONING"
  | "FUNCTIONAL_TRAINING"
  | "CARDIO_ENDURANCE"
  | "MOBILITY_FLEXIBILITY"
  | "CORRECTIVE_REHAB"
  | "SPORTS_PERFORMANCE"

export type TrainerItem = {
  id: string
  userId?: string
  name: string
  email: string
  phoneNumber: string
  profileUrl: string | null
  specialization: TrainerSpecialization | string
  experience: number
  rate: number
  createdAt: string
  updatedAt?: string
}

export type TrainerSearchQuery = PaginationQuery & {
  search?: string
}

export interface TrainerSlotItem {
  id: string
  description: string
  startTime: string
  endTime: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface GetTrainerSlotsParams {
  trainerId: string
  date?: string
}

export interface CreateTrainerSlotRequest {
  trainerId: string
  slotDate: string
  startTime: string
  endTime: string
  description?: string
}

export interface TrainerCount {
  countTrainer: number
  countTrainerWithSlot: number
  countSlot: number
  sumTransactionBookedTrainer: number
}

export interface TrainerBookingMember {
  id: string
  name: string
  email: string
  phoneNumber?: string | null
  profileUrl?: string | null
}

export interface TrainerBookingItem {
  id: string
  member: TrainerBookingMember
  trainer: TrainerItem
  slot: TrainerSlotItem
}

export type TrainerBookingSearchQuery = PaginationQuery & {
  trainerId?: string
  date?: string
}

export type TrainersApi = ApiResponsePaginate & {
  data: TrainerItem[]
}
export type TrainerSlotsApi = ApiResponse & {
  data: TrainerSlotItem[]
}
export type TrainerCountApi = ApiResponse & {
  data: TrainerCount
}
export type CreateTrainerSlotApi = ApiResponse & {
  data: TrainerSlotItem
}
export type TrainerBookingsApi = ApiResponsePaginate & {
  data: TrainerBookingItem[]
}
