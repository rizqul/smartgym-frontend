export type DateFormatVariant = "default" | "short" | "long" | "hour"

const FORMAT_OPTIONS: Record<DateFormatVariant, Intl.DateTimeFormatOptions> = {
  default: { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" },
  short: { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Jakarta" },
  long: { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" },
  hour: { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }
}

export function formatWIB(date: string | null | undefined, variant: DateFormatVariant = "default"): string {
  if (!date) return "-"

  try {
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00+07:00` : date
    const d = new Date(normalized)
    if (Number.isNaN(d.getTime())) return "-"

    const formatted = new Intl.DateTimeFormat("id-ID", FORMAT_OPTIONS[variant]).format(d)
    return variant === "hour" ? formatted.replace(".", ":") : formatted
  } catch {
    return "-"
  }
}

export const formatDateWIB = (date: string | null | undefined) => formatWIB(date, "default")
export const formatTimeWIB = (date: string | null | undefined) => formatWIB(date, "hour")
