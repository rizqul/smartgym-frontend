import { Copy, Loader2, RotateCcw } from "lucide-react"
import toast from "react-hot-toast"

import { TableTD, TableTR } from "~/components/ui/table"
import LocalDate from "~/components/ui/LocalDate"
import { Alert } from "~/utils/alert"
import { getAvatarUrl } from "~/utils/avatar"
import { formatRupiah } from "~/utils/format"
import { getTransactionStatusMeta, getTransactionTypeMeta } from "~/utils/transaction"
import { useRefundBookingMutation } from "~/services/transaction.service"
import type { TransactionItem } from "~/types/transaction.type"

interface TransactionTableRowProps {
  transaction: TransactionItem
  isEven: boolean
}

export default function TransactionTableRow({ transaction, isEven }: TransactionTableRowProps) {
  const [refundBooking, { isLoading: isRefunding }] = useRefundBookingMutation()

  const statusMeta = getTransactionStatusMeta(transaction.status)
  const typeMeta = getTransactionTypeMeta(transaction.type)
  const memberName = transaction.member?.name || "Member"
  const memberEmail = transaction.member?.email || "-"
  const canRefund = transaction.type?.toUpperCase() === "PT_BOOKING" && transaction.status?.toUpperCase() === "SUCCESS"

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(transaction.orderId)
      toast.success("Order ID successfully copied!")
    } catch {
      toast.error("Failed to copy Order ID.")
    }
  }

  const handleRefund = async () => {
    const result = await Alert.confirm({
      title: "Refund PT Booking?",
      text: `Are you sure you want to refund ${memberName}'s booking (Order ID: ${transaction.orderId}) for Rp ${formatRupiah(transaction.amount ?? 0)}? This action cannot be undone.`,
      confirmText: "Yes, Refund",
      isDanger: true
    })

    if (!result.isConfirmed) return

    try {
      const res = await refundBooking(transaction.orderId).unwrap()
      toast.success(res?.message || "Refund successfully!")
    } catch (error: unknown) {
      const apiErr = error as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Failed to refund booking.")
    }
  }

  return (
    <TableTR isEven={isEven}>
      <TableTD>
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(memberName, transaction.member?.profileUrl)}
            alt={memberName}
            className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover shadow-sm"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-bold text-white">{memberName}</span>
            <span className="text-text-muted max-w-55 truncate text-[12px] font-medium tracking-wide">{memberEmail}</span>
          </div>
        </div>
      </TableTD>

      <TableTD>
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${typeMeta.dotColor}`} />
          <span className="text-[13px] font-medium text-white">{typeMeta.label}</span>
        </div>
      </TableTD>

      <TableTD>
        <span className="text-[14px] font-bold whitespace-nowrap text-white">{formatRupiah(transaction.amount ?? 0)}</span>
      </TableTD>

      <TableTD>
        <div className="flex items-center gap-2">
          <span
            className="text-text-muted max-w-44 truncate font-mono text-[12px]"
            title={transaction.orderId}
          >
            {transaction.orderId}
          </span>
          <button
            type="button"
            onClick={handleCopyOrderId}
            aria-label="Copy Order ID"
            title="Copy Order ID"
            className="text-text-muted cursor-pointer rounded p-1 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </TableTD>

      <TableTD>
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
          <span className="text-text-muted text-[11px]">
            {transaction.paidAt ? (
              <>
                Paid: <LocalDate date={transaction.paidAt} />{" "}
                <LocalDate
                  date={transaction.paidAt}
                  variant="hour"
                />
              </>
            ) : (
              <>
                Made: <LocalDate date={transaction.createdAt} />
              </>
            )}
          </span>
        </div>
      </TableTD>

      <TableTD>
        <div className="flex items-center justify-end">
          {canRefund ? (
            <button
              type="button"
              onClick={handleRefund}
              disabled={isRefunding}
              title="Refund PT Booking"
              aria-label={`Refund ${transaction.orderId}`}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-bold text-amber-400 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefunding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
              <span>{isRefunding ? "Refunding..." : "Refund"}</span>
            </button>
          ) : (
            <span className="text-text-muted text-xs">-</span>
          )}
        </div>
      </TableTD>
    </TableTR>
  )
}
