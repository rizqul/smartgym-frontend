import { useState } from "react"
import { Link, useLocation } from "react-router"
import { ChevronDown, ChevronRight, X } from "lucide-react"

import { LogOut } from "lucide-react"

import useAuth from "~/hooks/useAuth"
import { Alert } from "~/utils/alert"
import { navigationMenu, type UserRole } from "../../config/navigation"
import logoGym from "../../assets/logo.png"
import { SidebarClock } from "../ui/SidebarClock"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const userRole = user?.role?.toLowerCase() as UserRole

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "User Management": true
  })

  const isActive = (path: string) => location.pathname === path

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const filteredMenus = navigationMenu
    .filter((item) => userRole && item.roles.includes(userRole))
    .map((item) => {
      if (item.children) {
        const visibleChildren = item.children.filter((child) => userRole && child.roles.includes(userRole))

        if (visibleChildren.length === 1) {
          return {
            ...item,
            title: visibleChildren[0].title,
            path: visibleChildren[0].path,
            children: undefined
          }
        }

        return {
          ...item,
          children: visibleChildren
        }
      }
      return item
    })
    .filter((item) => !item.children || item.children.length > 0)

  const groupedMenus = filteredMenus.reduce(
    (acc, item) => {
      const cat = item.category || "Lainnya"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    },
    {} as Record<string, typeof navigationMenu>
  )

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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-65 shrink-0 flex-col border-r border-white/4 bg-[#1C1F26] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center text-xl font-black tracking-tighter italic">
              <img
                src={logoGym}
                alt="SmartGym Logo"
                className="h-10 w-10 object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-[16px] font-bold tracking-wide text-white">
              Smart<span className="text-primary">Gym</span>
            </h1>
          </div>

          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {Object.entries(groupedMenus).map(([category, items]) => (
            <div key={category}>
              <p className="text-text-muted mb-3 px-3 text-[10px] font-bold tracking-widest uppercase">{category}</p>

              <div className="space-y-1">
                {items.map((menu) => {
                  const Icon = menu.icon

                  if (menu.children) {
                    const isDropdownOpen = openDropdowns[menu.title]

                    return (
                      <div key={menu.title}>
                        <button
                          onClick={() => toggleDropdown(menu.title)}
                          className="text-text-secondary flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <div className="flex items-center gap-3">
                            {Icon && <Icon className="h-5 w-5" />}
                            {menu.title}
                          </div>
                          {isDropdownOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>

                        {isDropdownOpen && (
                          <div className="mt-1 mb-2 ml-4 space-y-1 border-l border-white/8 pl-4">
                            {menu.children.map((child) => (
                              <Link
                                key={child.title}
                                to={child.path!}
                                onClick={onClose}
                                className={`relative block rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                                  isActive(child.path!)
                                    ? "overflow-hidden border-l-[3px] border-l-[#F97316] bg-white/5 text-[#FDBA74]"
                                    : "text-text-secondary border-l-[3px] border-l-transparent hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }

                  return (
                    <Link
                      key={menu.title}
                      to={menu.path!}
                      onClick={onClose}
                      className={`relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                        isActive(menu.path!)
                          ? "border-l-4 border-l-[#F97316] bg-white/5 text-[#FDBA74]"
                          : "text-text-secondary border-l-4 border-l-transparent hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {Icon && <Icon className={`h-5 w-5 ${isActive(menu.path!) ? "text-[#FDBA74]" : ""}`} />}
                      {menu.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-between gap-2 border-t border-white/10 px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <SidebarClock />
          </div>
          <button
            type="button"
            title="Log out"
            aria-label="Log out"
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  )
}
