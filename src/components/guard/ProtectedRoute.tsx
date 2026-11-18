import { Navigate, Outlet, useLocation } from "react-router"
import { useAppSelector } from "~/store/hooks"

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()

  const { data: user, status } = useAppSelector((state) => state.user)

  if (status === "loading") {
    return <div className="flex h-screen w-full items-center justify-center bg-[#0B0C10] text-white">Memuat sesi...</div>
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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return <Outlet />
}
