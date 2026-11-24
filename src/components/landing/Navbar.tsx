import { useState } from "react"
import { Link } from "react-router"
import { Menu, Smartphone, X } from "lucide-react"
import { landingNavigationMenu } from "~/config/navigation"
import logoGym from "../../assets/logo.png"

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleGetApp = () => {
    setMobileOpen(false)
    window.dispatchEvent(new CustomEvent("smartgym:open-app-qr"))

    const target = document.getElementById("alur-pendaftaran")
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <header className="bg-background/90 border-border/40 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex items-center justify-center text-xl font-black tracking-tighter italic">
            <img
              src={logoGym}
              alt="SmartGym Logo"
              className="h-10 w-10 object-contain drop-shadow-md"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-text-primary text-lg font-extrabold tracking-wide uppercase">
              SMART<span className="text-primary">GYM</span>
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {landingNavigationMenu.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Desktop Action */}
        <div className="hidden items-center lg:flex">
          <button
            type="button"
            onClick={handleGetApp}
            className="bg-primary hover:bg-primary-hover text-text-primary shadow-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            <span>Get App</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          className="border-border bg-surface text-text-secondary hover:text-text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="bg-surface border-border/60 border-b px-4 pt-3 pb-5 lg:hidden">
          <nav className="flex flex-col gap-1.5">
            {landingNavigationMenu.map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-text-secondary hover:bg-card hover:text-text-primary rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              >
                {link.title}
              </a>
            ))}
          </nav>

          <div className="border-border/60 mt-4 border-t pt-4">
            <button
              type="button"
              onClick={handleGetApp}
              className="bg-primary hover:bg-primary-hover text-text-primary inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              <Smartphone className="h-4 w-4" />
              <span>Get App</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
