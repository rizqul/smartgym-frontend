import { useMemo } from "react"
import { formatWIB, type DateFormatVariant } from "~/utils/date"

interface LocalDateProps {
  date: string | Date | null | undefined
  variant?: DateFormatVariant
  className?: string
}

export default function LocalDate({ date, variant = "default", className = "" }: LocalDateProps) {
  const formattedDate = useMemo(() => formatWIB(date, variant), [date, variant])

  return <span className={className}>{formattedDate}</span>
}
