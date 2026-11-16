import axios from "axios"

import type { BaseQueryFn } from "@reduxjs/toolkit/query"
import type { AxiosRequestConfig, AxiosError } from "axios"

export const axiosBaseQuery =
  (): BaseQueryFn<{
    url: string
    method?: AxiosRequestConfig["method"]
    data?: AxiosRequestConfig["data"]
    params?: AxiosRequestConfig["params"]
    headers?: AxiosRequestConfig["headers"]
  }> =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: URL.canParse(url) ? url : import.meta.env.VITE_API_URL + url,
        method,
        data,
        params,
        headers,
        withCredentials: true
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
