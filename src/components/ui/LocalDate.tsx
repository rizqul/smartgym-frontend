import { useMemo } from "react"

type LocalDateVariant = "default" | "short" | "long" | "hour"

interface LocalDateProps {
  date: string | null | undefined
  variant?: LocalDateVariant
  className?: string
}

const FORMAT_OPTIONS: Record<LocalDateVariant, Intl.DateTimeFormatOptions> = {
  default: { day: "2-digit", month: "short", year: "numeric" },
  short: { weekday: "long", day: "numeric", month: "short" },
  long: { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  hour: { hour: "2-digit", minute: "2-digit", hour12: false }
}

export default function LocalDate({ date, variant = "default", className = "" }: LocalDateProps) {
  const formattedDate = useMemo(() => {
    if (!date) return "-"

    try {
      const normalized = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date
      const d = new Date(normalized)
      if (Number.isNaN(d.getTime())) return "-"

      return new Intl.DateTimeFormat("id-ID", FORMAT_OPTIONS[variant]).format(d)
    } catch {
      return "-"
    }
  }, [date, variant])

  return <span className={className}>{formattedDate}</span>
}
