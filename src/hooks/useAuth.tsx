import { useNavigate } from "react-router"

import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { clearUser, storeUser } from "~/store/slices/authSlice"

import { axiosClient } from "~/utils/axios"
import { API_AUTH_LOGIN, API_AUTH_LOGOUT } from "~/utils/endpoints"

import type { LoginFormData } from "~/validation/authentication"
import type { LoginApi } from "~/types/responses"

export default function useAuth() {
  const navigate = useNavigate()

  const user = useAppSelector((state) => state.user.data)
  const dispatch = useAppDispatch()

  async function login(data: LoginFormData) {
    const { data: response } = await axiosClient.post<LoginApi>(API_AUTH_LOGIN, data)

    dispatch(storeUser(response.data))
    localStorage.setItem("isAuthenticated", String(true))

    navigate("/dashboard")
  }

  async function logout() {
    await axiosClient.post(API_AUTH_LOGOUT)

    dispatch(clearUser())
    localStorage.setItem("isAuthenticated", String(false))

    navigate("/")
  }

  return { user, login, logout }
}
