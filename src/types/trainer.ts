import type { ApiResponse, ApiResponsePaginate } from "~/types/common"

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

export type TrainerSearchQuery = {
  name?: string
  size?: number
  page?: number
}

export type TrainersApi = ApiResponsePaginate & {
  data: TrainerItem[]
}

export interface TrainerSlotItem {
  id: string
  description: string
  quota: number
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
  description: string
  slotDate: string
  startTime: string
  endTime: string
  quota: string
}

export type TrainerSlotsApi = ApiResponse & {
  data: TrainerSlotItem[]
}