import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import type { AxiosError, AxiosRequestConfig } from "axios"
import { axiosClient } from "~/utils/axios"

interface AxiosBaseQueryArgs {
  url: string | ((isStaff: boolean) => string)
  method?: AxiosRequestConfig["method"]
  data?: AxiosRequestConfig["data"]
  params?: AxiosRequestConfig["params"]
  headers?: AxiosRequestConfig["headers"]
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, unknown> =>
  async ({ url, method, data, params, headers }, api) => {
    try {
      const state = api.getState() as { user?: { data?: { role?: string } } }
      const isStaff = state.user?.data?.role?.toUpperCase() === "STAFF"
      const resolvedUrl = typeof url === "function" ? url(isStaff) : url

      const result = await axiosClient({
        url: resolvedUrl,
        method,
        data,
        params,
        headers
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message
        }
      }
    }
  }
