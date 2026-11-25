import { Card } from "~/components/ui/Card"
import { Table, TableBody, TableHead, TableTD, TableTH, TableTR } from "~/components/ui/table"
import type { TransactionItem } from "~/types/transaction.type"
import { formatRupiah } from "~/utils/format"

interface RecentTransactionCardProps {
  transactions: TransactionItem[]
}

const formatTransactionType = (type: string) => {
  if (type === "MEMBERSHIP") return "Membership"
  if (type === "PT_BOOKING" || type === "TRAINER") return "PT Booking"
  return type
}

export default function RecentTransactionCard({ transactions }: RecentTransactionCardProps) {
  return (
    <Card className="flex min-w-0 flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-text-primary text-[16px] font-bold sm:text-[17px]">Transaction Summary</h3>
          <p className="text-text-muted text-[12px] sm:text-[13px]">Latest Midtrans payment activity &amp; settlement summary</p>
        </div>

        <span className="border-border bg-card text-text-secondary inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold">
          <span className="bg-secondary h-1.5 w-1.5 rounded-full" />
          Auto-Settled
        </span>
      </div>

      <Table>
        <TableHead>
          <TableTR isHeader={true}>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">ID TRX &amp; MEMBER</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">TRANSACTION TYPE</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">AMOUNT</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">PAYMENT STATUS</div>
            </TableTH>
          </TableTR>
        </TableHead>
        <TableBody>
          {!transactions.length ? (
            <TableTR hideRowNumber>
              <TableTD colSpan={4}>
                <div className="text-text-muted py-10 text-center text-sm">No recent transactions.</div>
              </TableTD>
            </TableTR>
          ) : (
            transactions.map((trx, index) => {
              const statusUpper = trx.status?.toUpperCase()
              const isSuccess = statusUpper === "SUCCESS"
              const isPending = statusUpper === "PENDING" || statusUpper === "PROCESS"

              return (
                <TableTR
                  key={trx.id}
                  className={index % 2 === 0 ? "bg-transparent" : "bg-card/30"}
                >
                  <TableTD>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-text-primary truncate text-[13.5px] font-bold whitespace-nowrap">
                        {trx.member?.name ?? "-"}
                      </span>
                      <span className="text-primary/85 max-w-40 truncate font-mono text-[11px]">{trx.orderId}</span>
                    </div>
                  </TableTD>

                  <TableTD>
                    <span className="text-text-secondary text-[13px] whitespace-nowrap">{formatTransactionType(trx.type)}</span>
                  </TableTD>

                  <TableTD>
                    <span className="text-text-primary font-mono text-[13px] font-bold whitespace-nowrap tabular-nums">
                      Rp {formatRupiah(trx.amount)}
                    </span>
                  </TableTD>

                  <TableTD>
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${
                          isSuccess ? "bg-success/15 text-success" : isPending ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isSuccess ? "bg-success" : isPending ? "bg-warning" : "bg-danger"}`} />
                        {trx.status}
                      </span>
                      <span className="text-text-muted font-mono text-[10.5px]">{trx.paymentType ?? "-"}</span>
                    </div>
                  </TableTD>
                </TableTR>
              )
            })
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
