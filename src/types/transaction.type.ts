import type { ApiResponse, ApiResponsePaginate, PaginationQuery } from "~/types/common.type"

export interface UserTransactionResponse {
  id?: string
  name: string
  email: string
  phoneNumber?: string | null
  profileUrl?: string | null
}

export interface TransactionItem {
  id: string
  packageId: string
  orderId: string
  name?: string
  member: UserTransactionResponse
  type: string
  paymentType?: string | null
  paymentUrl: string | null
  amount: number
  status: string
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export type TransactionSearchQuery = PaginationQuery & {
  search?: string
  type?: string
  status?: string
}

export interface TransactionCount {
  sumTransactionYearly: number
  transactionSuccess: number
  transactionFailed: number
  transactionProcess: number
}

export type TransactionsApi = ApiResponsePaginate & {
  data: TransactionItem[]
}

export type TransactionCsvApi = ApiResponse & {
  data: TransactionItem[]
}

export type TransactionCountApi = ApiResponse & {
  data: TransactionCount
}

export type TransactionRefundApi = ApiResponse
