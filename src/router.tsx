import { createBrowserRouter } from "react-router"

import App, { AppErrorBoundary } from "./App"
import { authMiddleware, guestMiddleware, userGlobalMiddleware } from "./middleware/web"

import AuthLayout from "./layouts/AuthLayout"
import AppLayout from "./layouts/AppLayout"

import Home from "./app/Home"
import Login from "./app/auth/Login"
import ForgotPassword from "./app/auth/ForgotPassword"

import Dashboard from "./app/dashboard/Dashboard"
import MembershipPage from "./app/membership/MembershipPage"
import Settings from "./app/settings/Settings"
import ManageMembers from "./app/members/Members"
import CreateMember from "./app/members/CreateMember"
import EditMember from "./app/members/EditMember"
import ManageStaffs from "./app/Staffs/Staffs"
import EditStaff from "./app/Staffs/EditStaff"
import CreateStaff from "./app/Staffs/CreateStaff"

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
        middleware: [authMiddleware],
        children: [
          {
            index: true,
            Component: Dashboard
          },
          {
            path: "membership",
            Component: MembershipPage
          },
          {
            path: "settings",
            Component: Settings
          },
          {
            path: "members",
            children: [
              {
                index: true,
                Component: ManageMembers
              },
              {
                path: "create",
                Component: CreateMember
              },
              {
                path: ":id/edit",
                Component: EditMember
              }
            ]
          },
          {
            path: "staffs",
            children: [
              {
                index: true,
                Component: ManageStaffs
              },
              {
                path: "create",
                Component: CreateStaff
              },
              {
                path: ":id/edit",
                Component: EditStaff
              }
            ]
          }
        ]
      }
    ]
  }
])
