import { Outlet } from "react-router"
import { ShieldCheck } from "lucide-react"

import logoGym from "../assets/logo.png"

export default function AuthLayout() {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col overflow-hidden">

      <div className="bg-primary/[0.07] pointer-events-none absolute top-[-10%] left-1/2 h-150 w-200 -translate-x-1/2 rounded-full blur-[150px]"></div>

      <header className="relative z-10 flex w-full items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-primary/50 bg-[#0B0C10] drop-shadow-xl drop-shadow-primary/50">
              <img
                src={logoGym}
                alt="SmartGym Logo"
                className="h-10 w-10 object-contain drop-shadow-md"
              />
          </div>

          <div className="mt-0.5 flex flex-col justify-center">
            <h1 className="mb-1.5 text-[18px] leading-none font-bold tracking-wide">
              <span className="text-white">SMART</span>
              <span className="text-primary">GYM</span>
            </h1>
            <p className="text-text-secondary text-[9px] leading-none font-bold tracking-[0.2em] uppercase">Enterprise Portal</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/5 bg-surface/60 px-3 py-1.5 shadow-sm backdrop-blur-sm sm:flex">
          <ShieldCheck
            className="text-primary h-3.5 w-3.5"
            strokeWidth={2.5}
          />
          <span className="text-[10px] font-semibold tracking-wider text-white">LOGIN</span>
          <span className="text-text-muted text-[8px]">●</span>
          <span className="text-primary/90 text-[10px] font-semibold tracking-wider">RBAC SHIELD</span>
        </div>
      </header>

      <main className="relative z-10 flex w-full flex-1 items-center justify-center px-5">
        <Outlet />
      </main>

      <footer className="text-text-muted relative z-10 w-full px-5 py-6 text-center text-xs">
        © 2025 SmartGym Systems LLC • Portal Operasional Terenkripsi SSL
      </footer>
    </div>
  )
}
