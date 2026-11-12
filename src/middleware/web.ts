import { redirect, type MiddlewareFunction } from "react-router"

export const userGlobalMiddleware: MiddlewareFunction = () => {
  console.log("ini ke excute")
}

export const guestMiddleware: MiddlewareFunction = () => {
  throw redirect("/")
}
