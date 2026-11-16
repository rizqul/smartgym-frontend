import { redirect, type MiddlewareFunction } from "react-router"

import { store } from "~/store"
import { fetchUser } from "~/store/slices/authSlice"

export const userGlobalMiddleware: MiddlewareFunction = async () => {
  const user = store.getState().user
  const isAuthenticated = localStorage.getItem("isAuthenticated")

  if (!user.initialized && isAuthenticated != "false") {
    await store.dispatch(fetchUser())
  }
}

export const authMiddleware: MiddlewareFunction = () => {
  const user = store.getState().user

  if (user.status != "authenticated") {
    throw redirect("/")
  }
}

export const guestMiddleware: MiddlewareFunction = () => {
  const user = store.getState().user

  if (user.status == "authenticated") {
    throw redirect("/")
  }
}
