import { createBrowserRouter, Navigate } from "react-router"

import App, { AppErrorBoundary } from "./App"
import { authMiddleware, guestMiddleware, userGlobalMiddleware } from "./middleware/web"

import ProtectedRoute from "./components/guard/ProtectedRoute"

import AuthLayout from "./layouts/AuthLayout"
import AppLayout from "./layouts/AppLayout"
import LandingLayout from "./layouts/LandingLayout"

import Login from "./app/auth/Login"
import ForgotPassword from "./app/auth/ForgotPassword"

import Dashboard from "./app/dashboard/Dashboard"
import MembershipPage from "./app/membership/MembershipPage"
import Settings from "./app/settings/Settings"
import ManageMembers from "./app/members/Members"
import CreateMember from "./app/members/CreateMember"
import EditMember from "./app/members/EditMember"
import ManageStaffs from "./app/staffs/Staffs"
import EditStaff from "./app/staffs/EditStaff"
import CreateStaff from "./app/staffs/CreateStaff"
import CreateMembership from "./app/membership/CreateMembership"
import EditMembership from "./app/membership/EditMembership"
import Transaction from "./app/transactions/Transaction"
import TerminalKehadiran from "./app/attendance/TerminalKehadiran"
import Trainers from "./app/trainers/Trainers"
import NotFound from "./app/NotFound"
import CreateTrainer from "./app/trainers/CreateTrainer"
import LandingPage from "./app/LandingPage"
import EditTrainer from "./app/trainers/EditTrainer"

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    HydrateFallback: () => null,
    ErrorBoundary: AppErrorBoundary,
    middleware: [userGlobalMiddleware],
    children: [
      {
        Component: LandingLayout,
        children: [
          {
            index: true,
            Component: LandingPage
          }
        ]
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
            element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
            children: [
              {
                index: true,
                Component: Dashboard
              },
              {
                path: "staffs",
                children: [
                  { index: true, Component: ManageStaffs },
                  { path: "create", Component: CreateStaff },
                  { path: ":id/edit", Component: EditStaff }
                ]
              },
              {
                path: "transactions",
                Component: Transaction
              }
            ]
          },
          {
            path: "membership",
            children: [
              { index: true, Component: MembershipPage },
              {
                element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
                children: [
                  { path: "create", Component: CreateMembership },
                  { path: ":id/edit", Component: EditMembership }
                ]
              }
            ]
          },
          {
            path: "settings",
            Component: Settings
          },
          {
            path: "members",
            children: [
              { index: true, Component: ManageMembers },
              { path: "create", Component: CreateMember },
              { path: ":id/edit", Component: EditMember }
            ]
          },
          {
            path: "attendance",
            Component: TerminalKehadiran
          },
          {
            path: "trainers",
            children: [
              { index: true, Component: Trainers },
              {
                element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
                children: [
                  { path: "create", Component: CreateTrainer },
                  { path: ":id/edit", Component: EditTrainer }
                ]
              }
            ]
          }
        ]
      },
      {
        path: "404",
        Component: NotFound
      },
      {
        path: "*",
        element: (
          <Navigate
            to="/404"
            replace
          />
        )
      }
    ]
  }
])
