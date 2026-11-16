import { createBrowserRouter } from "react-router"

import App, { AppErrorBoundary } from "./App"
import { guestMiddleware, userGlobalMiddleware } from "./middleware/web"

import AuthLayout from "./layouts/AuthLayout"
import AppLayout from "./layouts/AppLayout"

import Home from "./app/Home"
import Login from "./app/auth/Login"
import Dashboard from "./app/dashboard/Dashboard"
import MembershipPage from "./app/membership/MembershipPage"
import ForgotPassword from "./app/auth/ForgotPassword"
import Settings from "./app/settings/Settings"
import ManageMembers from "./app/members/Members"
import CreateMember from "./app/members/CreateMember"
import EditMember from "./app/members/EditMember"

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
          },
          {
            path: "forgot-password",
            Component: ForgotPassword
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
          { path: "settings", Component: Settings },
          { path: "members", Component: ManageMembers },
          { path: "members/create", Component: CreateMember },
          { path: "members/:id/edit", Component: EditMember }
        ]
      }
    ]
  }
])
