import { useMemo } from "react"

interface LocalDateProps {
  date: string | null | undefined
  className?: string
}

export default function LocalDate({ date, className = "" }: LocalDateProps) {
  const formattedDate = useMemo(() => {
    if (!date) return "-"

    try {
      const d = new Date(date)
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(d)
    } catch {
      return "-"
    }
  }, [date])

  return <span className={className}>{formattedDate}</span>
}
