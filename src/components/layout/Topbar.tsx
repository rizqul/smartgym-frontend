import { Link } from "react-router"
import { LogOut } from "lucide-react"

import useAuth from "~/hooks/useAuth"
import { Alert } from "~/utils/alert"
import { getAvatarUrl } from "~/utils/avatar"
import { Breadcrumb } from "../ui/Breadcrumb"

export function Topbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    const result = await Alert.confirm({
      title: "Log out of the portal?",
      text: "You will need to log in again to access the system.",
      confirmText: "Yes, Log Out",
      isDanger: true
    })

    if (result.isConfirmed) await logout()
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/4 bg-[#1C1F26] px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Breadcrumb />
      </div>

      <div className="border-primary/75 bg-primary/50 flex shrink-0 items-center gap-1 rounded-xl border p-1">
        <Link
          to="/dashboard/settings"
          title="Profile Settings"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors hover:bg-primary/75"
        >
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(user?.name ?? "Guest", user?.profileUrl)}
              alt={user?.name ?? "User"}
              className="size-8 rounded-full border border-white/15 object-cover"
            />
            <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-[#1C1F26] bg-emerald-400" />
          </div>

          <div className="hidden flex-col text-left sm:flex">
            <span className="max-w-32 truncate text-xs leading-tight font-bold text-white">{user?.name ?? "Guest User"}</span>
            <span className="text-[10px] font-semibold tracking-wider text-white/75 uppercase">{user?.role ?? "Administrator"}</span>
          </div>
        </Link>

        <div className="h-6 w-px bg-white/15" />

        <button
          type="button"
          title="Log out"
          aria-label="Log out"
          onClick={handleLogout}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-red-500 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
