import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "~/config/axiosQuery"
import type { TransactionCountApi, TransactionsApi, TransactionSearchQuery } from "~/types/transaction"
import { API_ADMIN_TRANSACTIONS_COUNT, API_ADMIN_TRANSACTIONS_LIST } from "~/utils/endpoints"

export const transactionServiceApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Transactions"],
  endpoints: (build) => ({
    getAllTransactions: build.query<TransactionsApi, TransactionSearchQuery>({
      query: ({ search, type, status, page = 1, size = 10 }) => ({
        url: API_ADMIN_TRANSACTIONS_LIST,
        method: "GET",
        params: {
          page,
          size,
          ...(search ? { search } : {}),
          ...(type ? { type } : {}),
          ...(status ? { status } : {})
        }
      }),
      providesTags: ["Transactions"]
    }),
    getTransactionCount: build.query<TransactionCountApi, number | void>({
      query: (year) => ({
        url: API_ADMIN_TRANSACTIONS_COUNT,
        method: "GET",
        params: year ? { year } : undefined
      }),
      providesTags: ["Transactions"]
    })
  })
})

export const { useGetAllTransactionsQuery, useGetTransactionCountQuery } = transactionServiceApi
