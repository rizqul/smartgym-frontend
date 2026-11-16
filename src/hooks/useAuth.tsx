import { useNavigate } from "react-router"
import { isAxiosError } from "axios"

import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { clearUser, storeUser } from "~/store/slices/authSlice"

import { axiosClient } from "~/utils/axios"
import { API_AUTH_LOGIN, API_AUTH_LOGOUT, API_FORGOT_PASSWORD, API_RESET_PASSWORD } from "~/utils/endpoints"

import type { LoginFormData, ForgotPasswordEmailFormData, ForgotPasswordResetFormData } from "~/validation/authentication"
import type { LoginApi } from "~/types/responses"

export default function useAuth() {
  const navigate = useNavigate()

  const user = useAppSelector((state) => state.user.data)
  const dispatch = useAppDispatch()

  async function login(data: LoginFormData) {
    try {
      const { data: response } = await axiosClient.post<LoginApi>(API_AUTH_LOGIN, data)

      dispatch(storeUser(response.data))
      localStorage.setItem("isAuthenticated", String(true))

      navigate("/dashboard")
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Email atau kata sandi salah!")
        }
        throw new Error(error.response?.data?.message || "Gagal melakukan login.")
      }

      throw new Error("Terjadi kesalahan sistem yang tidak terduga.")
    }
  }

  async function requestPasswordReset(data: ForgotPasswordEmailFormData) {
    try {
      const { data: response } = await axiosClient.post(API_FORGOT_PASSWORD, data)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) throw new Error("Email tidak terdaftar.")
        throw new Error(error.response?.data?.message || "Gagal mengirim OTP.")
      }
      throw new Error("Terjadi kesalahan sistem.")
    }
  }

  async function resetPassword(payload: { email: string } & ForgotPasswordResetFormData) {
    try {
      const { data: response } = await axiosClient.post(API_RESET_PASSWORD, payload)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) throw new Error("Kode OTP salah atau sudah kedaluwarsa.")
        throw new Error(error.response?.data?.message || "Gagal mereset kata sandi.")
      }
      throw new Error("Terjadi kesalahan sistem.")
    }
  }

  async function logout() {
    try {
      await axiosClient.post(API_AUTH_LOGOUT)
      
    } catch (error) {
      console.warn("Sesi di server mungkin sudah berakhir atau terjadi masalah jaringan.")
      
    } finally {
      dispatch(clearUser())
      localStorage.setItem("isAuthenticated", String(false))
      navigate("/")
    }
  }
  return { user, login, logout, requestPasswordReset, resetPassword }
}
