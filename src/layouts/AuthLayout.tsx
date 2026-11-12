import { Outlet } from "react-router"

export default function AuthLayout() {
  return (
    <div className="flex flex-col gap-4">
      <div>Ini layout auth</div>

      <Outlet />
    </div>
  )
}
