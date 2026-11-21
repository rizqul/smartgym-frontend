import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { TransactionsApi, TransactionSearchQuery } from "~/types/transaction"
import { API_ADMIN_TRANSACTIONS_LIST } from "~/utils/endpoints"

export const transactionServiceApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Transactions"],
  endpoints: (build) => ({
    getAllTransactions: build.query<TransactionsApi, TransactionSearchQuery>({
      query: ({ page = 1, size = 10 }) => ({
        url: API_ADMIN_TRANSACTIONS_LIST,
        method: "GET",
        params: { page, size }
      }),
      providesTags: ["Transactions"]
    })
  })
})

export const { useGetAllTransactionsQuery } = transactionServiceApi
