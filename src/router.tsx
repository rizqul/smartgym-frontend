import { createBrowserRouter } from "react-router"

import App, { AppErrorBoundary } from "./App"
import { guestMiddleware, userGlobalMiddleware } from "./middleware/web"

import AuthLayout from "./layouts/AuthLayout"
import AppLayout from "./layouts/AppLayout"

import Home from "./app/Home"
import Login from "./app/auth/Login"
import Dashboard from "./app/dashboard/Dashboard"
import MembershipPage from "./app/membership/MembershipPage"

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
      },
      {
        path: "dashboard",
        Component: AppLayout,
        middleware: [userGlobalMiddleware],
        children: [
          { index: true, Component: Dashboard },
          { path: "membership", Component: MembershipPage },
        ]
      }
    ]
  }
])
