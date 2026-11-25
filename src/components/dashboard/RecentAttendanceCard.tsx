import { Ban, QrCode, RefreshCw } from "lucide-react"

import Avatar from "~/components/ui/Avatar"
import { Card } from "~/components/ui/Card"
import { Table, TableBody, TableHead, TableTD, TableTH, TableTR } from "~/components/ui/table"
import type { RecentAttendanceItem } from "~/types/dashboard.type"

interface RecentAttendanceCardProps {
  attendances: RecentAttendanceItem[]
  isRefreshing: boolean
  onRefresh: () => void
}

const formatTimeOnly = (isoDate?: string | null) => {
  if (!isoDate) return "-"
  return new Date(isoDate).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function RecentAttendanceCard({ attendances, isRefreshing, onRefresh }: RecentAttendanceCardProps) {
  return (
    <Card className="flex min-w-0 flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="bg-primary mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-text-primary text-[16px] font-bold sm:text-[17px]">Attendance Summary</h3>
            <p className="text-text-muted text-[12px] sm:text-[13px]">Latest member check-in &amp; check-out log (QR Gate System)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="border-border bg-card hover:bg-border/60 text-text-secondary inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
        >
          <RefreshCw className={`text-primary h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <Table>
        <TableHead>
          <TableTR isHeader={true}>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBER</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">CHECK-IN</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">CHECK-OUT</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">METHOD</div>
            </TableTH>
            <TableTH>
              <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS</div>
            </TableTH>
          </TableTR>
        </TableHead>
        <TableBody>
          {!attendances.length ? (
            <TableTR hideRowNumber>
              <TableTD colSpan={5}>
                <div className="text-text-muted py-10 text-center text-sm">No recent attendance records.</div>
              </TableTD>
            </TableTR>
          ) : (
            attendances.map((item, index) => {
              const memberName = item.member?.name ?? item.memberName ?? "Member"
              const memberSub = item.member?.email ?? `#${item.id.slice(0, 8)}`
              const normalizedStatus = item.status?.toUpperCase()
              const isDenied = normalizedStatus === "DENIED" || normalizedStatus === "REJECTED"
              const isOnFloor = !isDenied && !item.checkOutAt

              return (
                <TableTR
                  key={item.id}
                  className={isDenied ? "bg-danger/10" : index % 2 === 0 ? "bg-transparent" : "bg-card/30"}
                >
                  <TableTD>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={memberName}
                        src={item.member?.profileUrl ?? undefined}
                        className="h-9 w-9 shrink-0 rounded-full"
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="text-text-primary truncate text-[13.5px] font-bold">{memberName}</span>
                        <span className="text-text-muted truncate font-mono text-[11px]">{memberSub}</span>
                      </div>
                    </div>
                  </TableTD>

                  <TableTD>
                    <span className="text-text-secondary font-mono text-[13px] whitespace-nowrap">{formatTimeOnly(item.checkInAt)}</span>
                  </TableTD>

                  <TableTD>
                    {isDenied ? (
                      <span className="text-text-muted font-mono text-[13px]">-</span>
                    ) : item.checkOutAt ? (
                      <span className="text-success font-mono text-[13px] whitespace-nowrap">{formatTimeOnly(item.checkOutAt)}</span>
                    ) : (
                      <span className="text-secondary text-xs font-medium whitespace-nowrap">On Floor</span>
                    )}
                  </TableTD>

                  <TableTD>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                        isDenied ? "bg-card text-text-muted" : "bg-primary/15 text-primary"
                      }`}
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      QR App
                    </span>
                  </TableTD>

                  <TableTD>
                    {isDenied ? (
                      <span className="bg-danger/85 text-text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
                        <Ban className="h-3.5 w-3.5" />
                        Denied
                      </span>
                    ) : isOnFloor ? (
                      <span className="bg-secondary/15 text-secondary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
                        <span className="bg-secondary h-1.5 w-1.5 rounded-full" />
                        On Floor
                      </span>
                    ) : (
                      <span className="bg-success/15 text-success inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
                        <span className="bg-success h-1.5 w-1.5 rounded-full" />
                        Completed
                      </span>
                    )}
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
