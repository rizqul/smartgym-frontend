export type DateFormatVariant = "default" | "short" | "long" | "hour" | "time"

const FORMAT_OPTIONS: Record<DateFormatVariant, Intl.DateTimeFormatOptions> = {
  default: { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Jakarta" },
  short: { weekday: "long", day: "numeric", month: "short", timeZone: "Asia/Jakarta" },
  long: { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" },
  hour: { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jakarta" },
  time: { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Jakarta" }
}

export function formatWIB(date: string | Date | null | undefined, variant: DateFormatVariant = "default"): string {
  if (!date) return "-"

  try {
    const d = date instanceof Date ? date : new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00+07:00` : date)

    if (Number.isNaN(d.getTime())) return "-"

    const formatted = new Intl.DateTimeFormat("id-ID", FORMAT_OPTIONS[variant]).format(d)
    return variant === "hour" || variant === "time" ? formatted.replace(/\./g, ":") : formatted
  } catch {
    return "-"
  }
}

export const formatDateWIB = (date: string | Date | null | undefined) => formatWIB(date, "default")
export const formatTimeWIB = (date: string | Date | null | undefined) => formatWIB(date, "hour")
