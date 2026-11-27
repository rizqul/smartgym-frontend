import type { ApiResponse, ApiResponsePaginate } from "./common.type"

export type CheckinStatus = "GRANTED" | "DENIED"
export type CheckinMethod = "QR" | "RFID" | "MANUAL"

export interface CheckinMember {
  id: string
  name: string
  email?: string
  profileUrl?: string | null
  membershipExpiresAt?: string | null
}

export interface CheckinItem {
  id: string
  member: CheckinMember
  method: CheckinMethod
  status: CheckinStatus
  checkInAt: string
  checkOutAt: string | null
  denialReason: string | null
}

export interface CheckinSummary {
  historyCount: number
  checkinsToday: number
  activeNow: number
}

export interface CheckinToken {
  token: string
  expiresAt: string
  expiresInSeconds: number
}

export type CheckinListApi = ApiResponsePaginate & { data: CheckinItem[] }
export type CheckinDetailApi = ApiResponse & { data: CheckinItem }
export type CheckinSummaryApi = ApiResponse & { data: CheckinSummary }
export type CheckinTokenApi = ApiResponse & { data: CheckinToken }
