import { Navigate, Outlet, useLocation } from "react-router"
import { useAppSelector } from "~/store/hooks"

interface ProtectedRouteProps {
  allowedRoles?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ allowedRoles, redirectTo = "/404" }: ProtectedRouteProps) {
  const location = useLocation()
  const { data: user, status } = useAppSelector((state) => state.user)

  if (status === "loading") {
    return <div className="flex h-screen w-full items-center justify-center bg-[#0B0C10] text-white">Loading Session...</div>
  }

  if (status === "unauthenticated" || !user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    )
  }

  const userRole = user.role?.toLowerCase()
  const isAllowed = !allowedRoles || (userRole && allowedRoles.map((r) => r.toLowerCase()).includes(userRole))

  if (!isAllowed) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    )
  }

  return <Outlet />
}
