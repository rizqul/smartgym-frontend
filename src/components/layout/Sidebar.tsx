import { useState } from "react"
import { Link, useLocation } from "react-router"
import { LogOut, ChevronDown, ChevronRight, X } from "lucide-react"

import useAuth from "~/hooks/useAuth"

import { Button } from "../ui/Button"
import { Alert } from "../../utils/alert"
import { navigationMenu } from "../../config/navigation"

import logoGym from "../../assets/logo.png"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const location = useLocation()

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Manajemen User": true
  })

  const isActive = (path: string) => location.pathname === path

  const toggleDropdown = (title: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const groupedMenus = navigationMenu.reduce(
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
      title: "Keluar dari Portal?",
      text: "Anda harus login kembali untuk mengakses sistem.",
      confirmText: "Ya, Keluar",
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
        <div className="flex h-16 items-center justify-between border-b border-white/4 px-6">
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
                                className={`block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                                  isActive(child.path!)
                                    ? "text-primary bg-primary/10"
                                    : "text-text-secondary hover:bg-white/5 hover:text-white"
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
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                        isActive(menu.path!)
                          ? "bg-primary shadow-primary/20 text-white shadow-lg"
                          : "text-text-secondary hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      {menu.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/4 p-4">
          <div className="flex items-center justify-between rounded-xl border border-white/4 bg-[#0B0C10] p-1.5">
            <div className="flex items-center gap-3 pl-3">
              <span className="text-text-secondary text-[11px] font-medium">Role</span>
              <span className="bg-primary rounded-md px-3 py-1 text-[11px] font-bold text-white shadow-sm">Admin</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              title="Keluar"
              onClick={handleLogout}
              className="text-text-muted hover:text-danger hover:bg-danger/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
