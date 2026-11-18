import { useNavigate } from "react-router"
import { isAxiosError } from "axios"

import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { clearUser, storeUser } from "~/store/slices/authSlice"

import { axiosClient } from "~/utils/axios"
import { API_AUTH_LOGIN, API_AUTH_LOGOUT, API_FORGOT_PASSWORD, API_RESET_PASSWORD, API_VERIFY_OTP } from "~/utils/endpoints"

import type { LoginFormData, ForgotPasswordEmailFormData, ForgotPasswordResetFormData } from "~/validation/authentication"
import type { LoginApi } from "~/types/responses"

export default function useAuth() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.data)

  const login = async (data: LoginFormData) => {
    try {
      const payload = {
        email: data.email,
        password: data.password
      }

      const { data: response } = await axiosClient.post<LoginApi>(API_AUTH_LOGIN, payload)

      dispatch(storeUser(response.data))
      localStorage.setItem("isAuthenticated", "true")

      navigate("/dashboard")
    } catch (error) {
      if (isAxiosError(error)) {
        const backendMessage = error.response?.data?.message

        if (error.response?.status === 401 || error.response?.status === 404) {
          throw new Error(backendMessage || "Alamat Email atau Kata Sandi Salah!")
        }

        throw new Error(error.response?.data?.message || "Gagal melakukan login.")
      }
      throw new Error("Terjadi kesalahan sistem yang tidak terduga.")
    }
  }

  const requestPasswordReset = async (data: ForgotPasswordEmailFormData) => {
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

  const verifyOtp = async (payload: { email: string; code: string }) => {
    try {
      const { data: response } = await axiosClient.post(API_VERIFY_OTP, payload)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          throw new Error("Kode OTP salah atau sudah kedaluwarsa.")
        }
        throw new Error(error.response?.data?.message || "Gagal memverifikasi OTP.")
      }
      throw new Error("Terjadi kesalahan sistem.")
    }
  }

  const resetPassword = async (payload: { email: string } & ForgotPasswordResetFormData) => {
    try {
      const { data: response } = await axiosClient.post(API_RESET_PASSWORD, payload)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) throw new Error("Kode OTP salah atau sudah kedaluwarsa.")
        if (error.response?.status === 422) throw new Error("Format data tidak valid/tidak sesuai dengan server.")
        throw new Error(error.response?.data?.message || "Gagal mereset kata sandi.")
      }
      throw new Error("Terjadi kesalahan sistem.")
    }
  }

  const logout = async () => {
    try {
      await axiosClient.post(API_AUTH_LOGOUT)
    } catch (error) {
      console.warn("Sesi di server mungkin sudah berakhir atau terjadi masalah jaringan.")
    } finally {
      dispatch(clearUser())
      localStorage.setItem("isAuthenticated", "false")
      navigate("/")
    }
  }

  return { user, login, logout, requestPasswordReset, verifyOtp, resetPassword }
}
