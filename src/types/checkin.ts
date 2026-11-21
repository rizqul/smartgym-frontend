import type { ApiResponse } from "./common"

export type CheckinStatus = "GRANTED" | "DENIED"
export type CheckinMethod = "QR" | "RFID" | string

export interface CheckinItem {
  id: string
  memberId: string
  memberName: string
  membershipName: string
  membershipExpiresAt: string
  method: CheckinMethod
  status: CheckinStatus
  checkInAt: string
  denialReason: string | null
}

export interface CheckinSummary {
  historyCount: number
  checkinsToday: number
  onFloor: number
}

export interface CheckinToken {
  token: string
  expiresAt: string
  expiresInSeconds: number
}

export type CheckinListApi = ApiResponse & { data: CheckinItem[] }
export type CheckinSummaryApi = ApiResponse & { data: CheckinSummary }
export type CheckinTokenApi = ApiResponse & { data: CheckinToken }
