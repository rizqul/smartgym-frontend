import type { TransactionItem } from "~/types/transaction.type"

const escapeCsvValue = (value: string | number | null | undefined) => {
  const str = String(value ?? "")
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
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
      trx.name ?? "-",
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
