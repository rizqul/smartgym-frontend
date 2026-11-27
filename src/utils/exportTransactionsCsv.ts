import type { TransactionItem } from "~/types/transaction.type"

const ISO_DATETIME_REGEX = /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?/g
const TIME_RANGE_REGEX = /\b(\d{1,2}:\d{2})(?::\d{2})?\s*(?:[-–—]|to)\s*(\d{1,2}:\d{2})(?::\d{2})?\b/gi
const SINGLE_TIME_WITH_SECONDS_REGEX = /\b(\d{1,2}:\d{2}):\d{2}\b/g

const escapeCsvValue = (value: string | number | null | undefined) => {
  const str = String(value ?? "")
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

const formatTimeHHmm = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

const formatTransactionName = (name?: string | null) => {
  const trimmed = name?.trim()
  if (!trimmed) return "-"

  const withParsedDateTimes = trimmed.replace(ISO_DATETIME_REGEX, (match) => {
    const normalized = match.replace(" ", "T")
    const parsedDate = new Date(normalized)
    return Number.isNaN(parsedDate.getTime()) ? match : formatTimeHHmm(parsedDate)
  })

  return withParsedDateTimes
    .replace(TIME_RANGE_REGEX, (_, start: string, end: string) => `${start.padStart(5, "0")} - ${end.padStart(5, "0")}`)
    .replace(SINGLE_TIME_WITH_SECONDS_REGEX, (_, time: string) => time.padStart(5, "0"))
}

export function exportTransactionsToCsv(transactions: TransactionItem[], startDate: string, endDate: string) {
  const headers = [
    "Order ID",
    "Date",
    "Member Name",
    "Member Email",
    "Phone Number",
    "Type",
    "Item / Package",
    "Payment Method",
    "Amount (IDR)",
    "Status"
  ]

  const rows = transactions.map((trx) => {
    const rawDate = trx.paidAt ?? trx.createdAt
    const formattedDate = rawDate
      ? new Date(rawDate).toLocaleString("id-ID", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "-"

    return [
      trx.orderId,
      formattedDate,
      trx.member?.name ?? "-",
      trx.member?.email ?? "-",
      trx.member?.phoneNumber ?? "-",
      trx.type,
      formatTransactionName(trx.name),
      trx.paymentType ?? "-",
      trx.amount,
      trx.status
    ].map(escapeCsvValue)
  })

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", `smartgym-transactions-${startDate}-to-${endDate}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
