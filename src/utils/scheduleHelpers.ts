export const formatDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const getSlotStatusBadgeStyle = (status: string) => {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
    case "OPEN":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
    case "FULL":
    case "BOOKED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300"
    case "CANCELLED":
    case "CLOSED":
      return "border-red-500/20 bg-red-500/10 text-red-400"
    default:
      return "border-sky-500/20 bg-sky-500/10 text-sky-400"
  }
}
