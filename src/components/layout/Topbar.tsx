import { Link } from "react-router"

import useAuth from "~/hooks/useAuth"
import { getAvatarUrl } from "~/utils/avatar"
import { Breadcrumb } from "../ui/Breadcrumb"


export function Topbar() {
  const { user } = useAuth()
  const isStaff = user?.role === "STAFF"
  
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/4 bg-[#1C1F26] px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Breadcrumb isStaff={isStaff} />
      </div>

      <div className="border-primary/75 bg-primary/50 flex shrink-0 items-center gap-1 rounded-xl border p-1">
        <Link
          to="/dashboard/settings"
          title="Profile Settings"
          className="hover:bg-primary/75 flex items-center gap-2.5 rounded-lg px-2 py-1 transition-colors"
        >
          <div className="hidden flex-col text-left sm:flex">
            <span className="max-w-32 truncate text-xs leading-tight font-bold text-white">{user?.name ?? "Guest User"}</span>
            <span className="text-[10px] font-semibold tracking-wider text-white/75 uppercase">{user?.role ?? "Administrator"}</span>
          </div>
          <div className="h-6 w-px bg-white/15" />
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(user?.name ?? "Guest", user?.profileUrl)}
              alt={user?.name ?? "User"}
              className="size-8 rounded-full border border-white/15 object-cover"
            />
            <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-[#1C1F26] bg-emerald-400" />
          </div>
        </Link>
      </div>
    </header>
  )
}
