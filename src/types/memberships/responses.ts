import type { ApiResponse } from "../responses"
import type { MembershipPackage } from "./schema"

export type MembershipPackagesData = Record<string, Array<MembershipPackage>>

export type MembershipPackagesApi = ApiResponse & {
  data: MembershipPackagesData
}
