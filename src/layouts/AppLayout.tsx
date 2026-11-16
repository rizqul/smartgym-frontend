import { useState } from "react"
import { Outlet } from "react-router"
import { Menu } from "lucide-react"
import { Sidebar } from "../components/layout/Sidebar"
import { Topbar } from "../components/layout/Topbar"
import useAuth from "~/hooks/useAuth"

export default function AppLayout() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      {user && (
        <div className="text-text-primary flex min-h-screen w-full overflow-hidden bg-[#0B0C10]">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center border-b border-white/4 bg-[#1C1F26] lg:border-none">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-text-secondary p-4 hover:text-white lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex-1">
                <Topbar />
              </div>
            </div>

            <main className="custom-scrollbar relative flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="bg-primary/3 pointer-events-none absolute top-0 left-1/2 h-100 w-150 -translate-x-1/2 rounded-full blur-[120px]"></div>

              <div className="relative z-10">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  )
}
