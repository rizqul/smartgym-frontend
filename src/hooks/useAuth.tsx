import { useNavigate } from "react-router"
import { isAxiosError } from "axios"

import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { clearUser, storeUser } from "~/store/slices/authSlice"

import { axiosClient } from "~/utils/axios"
import { API_AUTH_LOGIN, API_AUTH_LOGOUT, API_FORGOT_PASSWORD, API_RESET_PASSWORD, API_VERIFY_OTP } from "~/utils/endpoints"

import type { LoginFormData, ForgotPasswordEmailFormData, ForgotPasswordResetFormData } from "~/validation/authentication"
import type { LoginApi } from "~/types/user"
import { userServiceApi } from "~/services/user"
import { memberServiceApi } from "~/services/member"
import { staffServiceApi } from "~/services/staff"
import { trainerServiceApi } from "~/services/trainer"
import { membershipPackageServiceApi } from "~/services/membershipPackage"
import { checkinServiceApi } from "~/services/checkin"
import { transactionServiceApi } from "~/services/transaction"
import { useState } from "react"

export default function useAuth() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.data)
  const ALLOWED_PORTAL_ROLES = ["admin", "staff"]
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const login = async (data: LoginFormData) => {
    try {
      const payload = { email: data.email, password: data.password }
      const { data: response } = await axiosClient.post<LoginApi>(API_AUTH_LOGIN, payload)

      const userRole = response.data.role?.toLowerCase()

      if (!userRole || !ALLOWED_PORTAL_ROLES.includes(userRole)) {
        await axiosClient.post(API_AUTH_LOGOUT).catch(() => {})
        throw new Error("Access denied! This portal is only for Admins and Staff.")
      }

      dispatch(storeUser(response.data))
      localStorage.setItem("isAuthenticated", "true")

      if (userRole === "staff") {
        navigate("/dashboard/members")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const backendMessage = error.response?.data?.message

        if (error.response?.status === 401 || error.response?.status === 404) {
          throw new Error(backendMessage || "Incorrect email address or password!")
        }

        throw new Error(error.response?.data?.message || "Failed to log in.")
      }
      throw new Error("Please enter a valid email and password.")
    }
  }

  const requestPasswordReset = async (data: ForgotPasswordEmailFormData) => {
    try {
      const { data: response } = await axiosClient.post(API_FORGOT_PASSWORD, data)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) throw new Error("Email is not registered.")
        throw new Error(error.response?.data?.message || "Failed to send OTP.")
      }
      throw new Error("A system error occurred.")
    }
  }

  const verifyOtp = async (payload: { email: string; code: string }) => {
    try {
      const { data: response } = await axiosClient.post(API_VERIFY_OTP, payload)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400 || error.response?.status === 404) {
          throw new Error("Invalid or expired OTP code.")
        }
        throw new Error(error.response?.data?.message || "Failed to verify OTP.")
      }
      throw new Error("A system error occurred.")
    }
  }

  const resetPassword = async (payload: { email: string } & ForgotPasswordResetFormData) => {
    try {
      const { data: response } = await axiosClient.post(API_RESET_PASSWORD, payload)
      return response
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) throw new Error("Invalid or expired OTP code.")
        if (error.response?.status === 422) throw new Error("Invalid data format or server mismatch.")
        throw new Error(error.response?.data?.message || "Failed to reset password.")
      }
      throw new Error("A system error occurred.")
    }
  }

  const logout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
  
    try {
      await axiosClient.post(API_AUTH_LOGOUT)
    } catch (error) {
      console.warn("The server session may have expired or a network issue occurred.", error)
    } finally {
      dispatch(clearUser())
  
      const apisToReset = [
        userServiceApi,
        memberServiceApi,
        staffServiceApi,
        membershipPackageServiceApi,
        trainerServiceApi,
        checkinServiceApi,
        transactionServiceApi
      ]
  
      apisToReset.forEach((api) => dispatch(api.util.resetApiState()))
  
      localStorage.setItem("isAuthenticated", "false")
      setIsLoggingOut(false)
      navigate("/auth/login", { replace: true })
    }
  }

  return { user, login, logout, requestPasswordReset, verifyOtp, resetPassword }
}
