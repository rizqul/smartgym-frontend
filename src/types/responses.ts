import type { User } from "./schema"

export type PaginationMeta = {
  paginate: {
    size: number
    currentPage: number
    totalPages: number
    totalData: number
    prevUrl: string | null
    nextUrl: string | null
    links: Array<{
      label: string
      active: boolean
      url: string | null
    }>
  }
}

export type ApiResponse = {
  statusCode: number
  message: string
}

export type ApiResponsePaginate = ApiResponse & PaginationMeta

export type LoginApi = ApiResponse & {
  data: User
}

export type UserApi = ApiResponse & {
  data: User
}

export type MembersApi = ApiResponsePaginate & {
  data: Array<User>
}

export type StaffsApi = ApiResponsePaginate & {
  data: Array<User>
}
