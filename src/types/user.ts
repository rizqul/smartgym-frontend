import type { ApiResponse, ApiResponsePaginate } from "./common"

export type UserRole = "ADMIN" | "STAFF" | "MEMBER"

export type User = {
  id: string
  name: string
  email: string
  profileUrl: string | null
  phoneNumber: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type MemberSearchQuery = {
  page?: number
  size?: number
  name?: string
}

export type StaffSearchQuery = {
  page?: number
  size?: number
  name?: string
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

export type LoginApi = ApiResponse & { data: User }
export type UserApi = ApiResponse & { data: User }
export type MembersApi = ApiResponsePaginate & { data: Array<User> }
export type StaffsApi = ApiResponsePaginate & { data: Array<User> }
