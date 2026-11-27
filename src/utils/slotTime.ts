import { getCurrentHourWIB, getTodayWIB } from "~/utils/date"

export const GYM_OPEN_HOUR = 7
export const GYM_CLOSE_HOUR = 21
export const GYM_OPEN_TIME = `${String(GYM_OPEN_HOUR).padStart(2, "0")}:00`
export const GYM_CLOSE_TIME = `${String(GYM_CLOSE_HOUR).padStart(2, "0")}:00`

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h} hour${h > 1 ? "s" : ""} ${m} minute${m > 1 ? "s" : ""}`
  if (h > 0) return `${h} hour${h > 1 ? "s" : ""}`
  return `${m} minute${m > 1 ? "s" : ""}`
}

export const getDurationMinutes = (startHour?: string, endHour?: string) => {
  if (!startHour || !endHour) return 0
  const [sh, sm] = startHour.split(":").map(Number)
  const [eh, em] = endHour.split(":").map(Number)
  if ([sh, sm, eh, em].some(Number.isNaN)) return 0
  return eh * 60 + em - (sh * 60 + sm)
}

export const getMinStartTime = (slotDate: string) => {
  if (slotDate !== getTodayWIB()) return GYM_OPEN_TIME
  const currentHour = getCurrentHourWIB()
  const clampedHour = Math.min(Math.max(currentHour, GYM_OPEN_HOUR), GYM_CLOSE_HOUR)
  return `${String(clampedHour).padStart(2, "0")}:00`
}

export const getDefaultHours = (slotDate: string) => {
  if (slotDate !== getTodayWIB()) {
    return { startHour: "08:00", endHour: "09:00" }
  }

  const nextHour = Math.max(getCurrentHourWIB() + 1, GYM_OPEN_HOUR)
  if (nextHour >= GYM_CLOSE_HOUR) {
    return { startHour: "", endHour: "" }
  }

  const endHour = Math.min(nextHour + 1, GYM_CLOSE_HOUR)

  return {
    startHour: `${String(nextHour).padStart(2, "0")}:00`,
    endHour: `${String(endHour).padStart(2, "0")}:00`
  }
}

export const isWithinOperatingHours = (startHour?: string, endHour?: string) => {
  if (!startHour || !endHour) return false
  return startHour >= GYM_OPEN_TIME && startHour < GYM_CLOSE_TIME && endHour > GYM_OPEN_TIME && endHour <= GYM_CLOSE_TIME
}
