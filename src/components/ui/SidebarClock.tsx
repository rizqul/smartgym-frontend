import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import LocalDate from "./LocalDate"

export function SidebarClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="shrink-0 border-t border-white/5 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <Clock className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <LocalDate
              date={now}
              variant="time"
              className="font-mono text-sm font-bold tracking-wide text-white tabular-nums"
            />
            <span className="text-primary text-[10px] font-semibold">WIB</span>
          </div>
          <LocalDate
            date={now}
            variant="long"
            className="text-text-muted block truncate text-[11px]"
          />
        </div>
      </div>
    </div>
  )
}