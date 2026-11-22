import type { ApiResponse } from "./common"

export type CheckinStatus = "GRANTED" | "DENIED"
export type CheckinMethod = "QR" | "RFID" | "MANUAL"

export interface CheckinItem {
  id: string
  memberId: string
  memberName: string
  membershipExpiresAt: string | null
  method: CheckinMethod
  status: CheckinStatus
  checkInAt: string
  checkOutAt: string | null
  denialReason: string | null
  duplicate: boolean
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
export type CheckinDetailApi = ApiResponse & { data: CheckinItem} 
export type CheckinSummaryApi = ApiResponse & { data: CheckinSummary }
export type CheckinTokenApi = ApiResponse & { data: CheckinToken }
