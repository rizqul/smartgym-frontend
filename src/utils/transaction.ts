export const getTransactionStatusMeta = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
    case "PAID":
    case "SETTLEMENT":
      return {
        label: "Berhasil",
        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      }
    case "PROCESS":
      return {
        label: "Diproses",
        className: "border-sky-500/20 bg-sky-500/10 text-sky-400"
      }
    case "PENDING":
      return {
        label: "Menunggu",
        className: "border-amber-500/20 bg-amber-500/10 text-amber-300"
      }
    case "EXPIRED":
      return {
        label: "Kedaluwarsa",
        className: "border-orange-500/20 bg-orange-500/10 text-orange-400"
      }
    case "CANCELLED":
    case "FAILED":
      return {
        label: "Dibatalkan",
        className: "border-red-500/20 bg-red-500/10 text-red-400"
      }
    default:
      return {
        label: status || "-",
        className: "border-white/10 bg-white/5 text-text-muted"
      }
  }
}

export const getTransactionTypeMeta = (type?: string) => {
  switch (type?.toUpperCase()) {
    case "MEMBERSHIP":
      return { label: "Membership", dotColor: "bg-primary" }
    case "TRAINER":
    case "TRAINER_BOOKING":
    case "PT_BOOKING":
      return { label: "PT Booking", dotColor: "bg-sky-400" }
    default:
      return {
        label: type ? type.replace(/_/g, " ") : "-",
        dotColor: "bg-gray-400"
      }
  }
}
