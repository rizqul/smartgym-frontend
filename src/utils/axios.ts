import axios, { AxiosError, type CreateAxiosDefaults, type InternalAxiosRequestConfig } from "axios"

const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  headers: {
    Accept: "application/json"
  }
}

const axiosClient = axios.create(config)
const axiosRefresh = axios.create(config)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (!config || config._retry || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    try {
      config._retry = true

      await axiosRefresh.post("/auth/refresh")
      const response = await axiosClient(config)

      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }
)

export { axiosClient }
