import { useEffect } from "react"
import { Outlet } from "react-router"
import Lenis from "lenis"

import LandingNavbar from "~/components/landing/Navbar"
import LandingFooter from "~/components/landing/Footer"
import ScrollToTopButton from "~/components/landing/ScrollToTopButton"

export default function LandingLayout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true
    })

    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href === "#") return

      const section = document.querySelector(href)
      if (!section) return

      e.preventDefault()
      lenis.scrollTo(section as HTMLElement, {
        offset: -80,
        duration: 1.2
      })
    }

    document.addEventListener("click", handleAnchorClick)

    return () => {
      document.removeEventListener("click", handleAnchorClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="bg-background text-text-primary flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
      <ScrollToTopButton />
    </div>
  )
}
