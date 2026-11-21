import type { ApiResponsePaginate } from "~/types/common"

export interface UserTransactionResponse {
  id?: string
  name: string
  email: string
  profileUrl?: string | null
}

export interface TransactionItem {
  id: string
  packageId: string
  orderId: string
  member: UserTransactionResponse
  type: string
  paymentUrl: string | null
  amount: number
  status: string
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionSearchQuery {
  page?: number
  size?: number
}

export type TransactionsApi = ApiResponsePaginate & {
  data: TransactionItem[]
}
