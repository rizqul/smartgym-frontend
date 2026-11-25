import type { ApiResponse, ApiResponsePaginate, PaginationQuery } from "./common.type"

export type UserRole = "ADMIN" | "STAFF" | "MEMBER"

export type User = {
  id: string
  name: string
  email: string
  profileUrl: string | null
  phoneNumber: string
  membershipExpiredAt: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type MemberSearchQuery = PaginationQuery & {
  search?: string
  membership?: boolean
}

export type StaffSearchQuery = PaginationQuery & {
  search?: string
}

export type UpdateProfileRequest = {
  name?: string
  phoneNumber?: string
  profileUrl?: string
}

export type UpdatePasswordRequest = {
  email: string
  oldPassword: string
  newPassword: string
}

export interface UpdateMemberPayload {
  id: string
  data: FormData
}

export interface UpdateStaffPayload {
  id: string
  data: FormData
}

export interface MemberCount {
  memberCount: number
  memberActiveCount: number
  memberInactiveCount: number
  newMemberCount: number
}

export interface StaffCount {
  staffCount: number
}

export type LoginApi = ApiResponse & { data: User }
export type UserApi = ApiResponse & { data: User }
export type MembersApi = ApiResponsePaginate & { data: Array<User> }
export type StaffsApi = ApiResponsePaginate & { data: Array<User> }
export type MemberCountApi = ApiResponse & { data: MemberCount }
export type StaffCountApi = ApiResponse & { data: StaffCount }
