import { createBrowserRouter } from "react-router"

import App, { AppErrorBoundary } from "./App"
import { guestMiddleware, userGlobalMiddleware } from "./middleware/web"

import Home from "./app/Home"

import AuthLayout from "./layouts/AuthLayout"
import Login from "./app/auth/Login"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    HydrateFallback: () => null,
    ErrorBoundary: AppErrorBoundary,
    middleware: [userGlobalMiddleware],
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "auth",
        Component: AuthLayout,
        middleware: [guestMiddleware],
        children: [
          {
            path: "login",
            Component: Login
          }
        ]
      }
    ]
  }
])
