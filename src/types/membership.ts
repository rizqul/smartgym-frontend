import type { ApiResponse } from "./common"

export type MembershipPackage = {
  id: string
  name: string
  description: string
  type: string
  duration: number
  price: number
}

export type CreateMembershipPackageRequest = {
  type: string
  name: string
  description: string
  duration: number
  price: number
}

export type MembershipPackagesData = Record<string, Array<MembershipPackage>>

export type MembershipPackagesApi = ApiResponse & {
  data: MembershipPackagesData
}
