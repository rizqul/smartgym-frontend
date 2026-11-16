import type { User } from "./schema"

export type ApiResponse = {
  statusCode: number
  message: string
}

export type LoginApi = ApiResponse & {
  data: User
}

export type UserApi = ApiResponse & {
  data: User
}
