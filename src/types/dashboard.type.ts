import type { ApiResponse } from "~/types/common.type"
import type { TransactionItem } from "~/types/transaction.type"

export interface DashboardCountResponse {
  allMember: number
  activeMember: number
  totalTrainer: number
  staffCount: number
  incomeYearly: number
}

export interface AttendanceHourlySlot {
  label: string
  todayCount: number
  lastWeekCount: number
}

export interface AttendanceHourlyChartResponse {
  date: string
  slots: AttendanceHourlySlot[]
}

export interface RecentAttendanceItem {
  id: string
  memberName?: string
  member?: {
    id?: string
    name: string
    email?: string
    profileUrl?: string | null
  }
  status: string
  checkInAt: string
  checkOutAt?: string | null
}

export interface DashboardRecentResponse {
  attendanceResponse: RecentAttendanceItem[]
  transactionResponses: TransactionItem[]
}

export type DashboardCountApi = ApiResponse & {
  data: DashboardCountResponse
}

export type DashboardChartApi = ApiResponse & {
  data: AttendanceHourlyChartResponse
}

export type DashboardRecentApi = ApiResponse & {
  data: DashboardRecentResponse
}
