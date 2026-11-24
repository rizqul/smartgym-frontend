import { Activity, Award, Ban, Dumbbell, QrCode, RefreshCw, ShieldCheck, TrendingUp, Users, Wallet, Wifi } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import useAuth from "~/hooks/useAuth"
import { Card } from "~/components/ui/Card"
import { CardStats } from "~/components/ui/CardStats"
import Avatar from "~/components/ui/Avatar"
import { Table, TableHead, TableBody, TableTR, TableTH, TableTD } from "~/components/ui/table"

interface VisitorChartPoint {
  hour: string
  today: number
  average: number
}

const DUMMY_VISITOR_CHART: VisitorChartPoint[] = [
  { hour: "06:00", today: 18, average: 22 },
  { hour: "08:00", today: 36, average: 32 },
  { hour: "10:00", today: 48, average: 42 },
  { hour: "12:00", today: 54, average: 46 },
  { hour: "14:00", today: 52, average: 44 },
  { hour: "16:00", today: 76, average: 56 },
  { hour: "18:00", today: 96, average: 68 },
  { hour: "20:00", today: 74, average: 62 },
  { hour: "22:00", today: 32, average: 38 }
]

const DUMMY_ATTENDANCE = [
  {
    id: "1",
    memberName: "Bima Arya Pratama",
    memberCode: "#MBR-88219",
    checkInTime: "18:24",
    checkOutTime: null as string | null,
    method: "QR" as const,
    status: "GRANTED" as const
  },
  {
    id: "2",
    memberName: "Clarissa Devina",
    memberCode: "#MBR-79012",
    checkInTime: "18:22",
    checkOutTime: "19:45",
    method: "RFID" as const,
    status: "GRANTED" as const
  },
  {
    id: "3",
    memberName: "Rian Setyadi",
    memberCode: "#MBR-44109",
    checkInTime: "18:19",
    checkOutTime: null as string | null,
    method: "QR" as const,
    status: "DENIED" as const
  },
  {
    id: "4",
    memberName: "Hendra Gunawan",
    memberCode: "#MBR-90112",
    checkInTime: "18:15",
    checkOutTime: "19:30",
    method: "QR" as const,
    status: "GRANTED" as const
  },
  {
    id: "5",
    memberName: "Nadia Wulandari",
    memberCode: "#MBR-61029",
    checkInTime: "18:11",
    checkOutTime: null as string | null,
    method: "RFID" as const,
    status: "GRANTED" as const
  }
]

const DUMMY_TRANSACTIONS = [
  {
    id: "1",
    trxCode: "#TRX-8921",
    memberName: "Andi Wijaya",
    type: "Membership",
    amount: "Rp 4.200.000",
    status: "PAID" as const,
    refCode: "#MID-9481"
  },
  {
    id: "2",
    trxCode: "#TRX-8920",
    memberName: "Siti Sarah",
    type: "PT Booking",
    amount: "Rp 2.500.000",
    status: "PENDING" as const,
    refCode: "#MID-9479"
  },
  {
    id: "3",
    trxCode: "#TRX-8919",
    memberName: "Kevin Alamsyah",
    type: "Membership",
    amount: "Rp 450.000",
    status: "PAID" as const,
    refCode: "#MID-9476"
  },
  {
    id: "4",
    trxCode: "#TRX-8918",
    memberName: "Dewi Lestari",
    type: "PT Booking",
    amount: "Rp 980.000",
    status: "PAID" as const,
    refCode: "#POS-0082"
  }
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey?: string
    value?: number
  }>
  label?: string
}

function VisitorTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const todayVal = payload.find((p) => p.dataKey === "today")?.value ?? 0
  const avgVal = payload.find((p) => p.dataKey === "average")?.value ?? 0

  return (
    <div className="bg-background border-border rounded-xl border px-3.5 py-2.5 shadow-xl">
      <p className="text-text-muted text-[10px] font-bold tracking-wider uppercase">HOUR {label}</p>
      <p className="text-primary mt-1 text-[12px] font-semibold">
        Visitors: <span className="text-text-primary">{todayVal} People</span>
      </p>
      <p className="text-info text-[12px] font-semibold">
        7-Day Average: <span className="text-text-primary">{avgVal} People</span>
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-text-primary text-xl font-bold sm:text-2xl">Dashboard Overview</h1>
        <p className="text-text-muted text-[13px] sm:text-[14px]">
          An overview of operational performance, daily visitor traffic, member attendance, and SmartGym transactions.
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${isAdmin ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
        <CardStats
          topIcon={<Users className="text-info" />}
          bottomIcon={<TrendingUp className="text-info" />}
          label="Total Members"
          subLabel="Registered"
          value="2.845"
        />
        <CardStats
          topIcon={<Award className="text-secondary" />}
          bottomIcon={<TrendingUp className="text-secondary" />}
          label="Active Members"
          subLabel="Active Memberships"
          value="2.350"
        />
        <CardStats
          topIcon={<Dumbbell className="text-warning" />}
          bottomIcon={<TrendingUp className="text-warning" />}
          label="Total Trainers"
          subLabel="Personal Trainers"
          value={24}
        />
        <CardStats
          topIcon={<ShieldCheck className="text-success" />}
          bottomIcon={<TrendingUp className="text-success" />}
          label="Total Staff"
          subLabel="Operations Team"
          value={12}
        />
        {isAdmin && (
          <CardStats
            topIcon={<Wallet className="text-primary" />}
            bottomIcon={<TrendingUp className="text-primary" />}
            label="Total Transactions"
            subLabel="Revenue"
            value="Rp 184,5M"
          />
        )}
      </div>

      <Card className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-text-primary text-base font-bold sm:text-lg">Daily Visitor Traffic</h2>
              <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold">
                <Activity className="h-3.5 w-3.5" />
                Live Turnstile Data
              </span>
            </div>
            <p className="text-text-muted text-[12px] sm:text-[13px]">
              Hourly visitor check-in trends (06:00 - 22:00) &amp; estimated floor capacity
            </p>
          </div>

          <div className="border-border/60 bg-background/60 flex flex-wrap items-center gap-4 rounded-xl border px-4 py-2.5">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">DAILY AVERAGE</span>
              <span className="text-text-primary text-sm font-bold">420 Members</span>
            </div>
            <div className="bg-border h-7 w-px" />
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">PEAK HOURS</span>
              <span className="text-primary text-sm font-bold">17:00 - 20:00</span>
            </div>
          </div>
        </div>

        <div className="border-border/50 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-[12px]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-text-primary flex items-center gap-2">
              <span className="bg-primary h-2.5 w-2.5 rounded-sm" />
              <span>Today's Visitors (382 Check-ins)</span>
            </div>
            <div className="text-text-secondary flex items-center gap-2">
              <span className="bg-info h-2.5 w-2.5 rounded-sm" />
              <span>Historical Average (7 Days)</span>
            </div>
          </div>
          <div className="text-text-muted text-[12px]">
            Peak Load: <strong className="text-secondary">96 People</strong> <span className="text-border">|</span>{" "}
            <strong className="text-text-primary">18:00</strong>
          </div>
        </div>

        <div className="h-64 w-full sm:h-72">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={DUMMY_VISITOR_CHART}
              margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="todayAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="avgAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-info)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-info)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                strokeOpacity={0.35}
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                stroke="var(--color-text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="var(--color-text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={<VisitorTooltip />}
                cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="average"
                stroke="var(--color-info)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#avgAreaGrad)"
                activeDot={{ r: 4, fill: "var(--color-info)", stroke: "var(--color-text-primary)", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="today"
                stroke="var(--color-primary)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#todayAreaGrad)"
                activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "var(--color-text-primary)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className={`grid grid-cols-1 gap-6 ${isAdmin ? "2xl:grid-cols-2" : ""}`}>
        <Card className="flex min-w-0 flex-col gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="bg-primary mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" />
              <div className="flex flex-col gap-0.5">
                <h3 className="text-text-primary text-[16px] font-bold sm:text-[17px]">Attendance Summary</h3>
                <p className="text-text-muted text-[12px] sm:text-[13px]">Today's member check-in &amp; check-out log (Live Gate System)</p>
              </div>
            </div>

            <span className="border-border bg-card text-text-secondary inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold">
              <RefreshCw className="text-primary h-3.5 w-3.5" />
              Real-time
            </span>
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
              {DUMMY_ATTENDANCE.map((item, index) => {
                const isDenied = item.status === "DENIED"
                const isOnFloor = !isDenied && !item.checkOutTime
                const isQr = item.method === "QR"

                return (
                  <TableTR
                    key={item.id}
                    className={isDenied ? "bg-danger/10" : index % 2 === 0 ? "bg-transparent" : "bg-card/30"}
                  >
                    <TableTD>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={item.memberName}
                          className="h-9 w-9 shrink-0 rounded-full"
                        />
                        <div className="flex min-w-0 flex-col">
                          <span className="text-text-primary truncate text-[13.5px] font-bold">{item.memberName}</span>
                          <span className="text-text-muted font-mono text-[11px]">{item.memberCode}</span>
                        </div>
                      </div>
                    </TableTD>

                    <TableTD>
                      <span className="text-text-secondary font-mono text-[13px] whitespace-nowrap">{item.checkInTime}</span>
                    </TableTD>

                    <TableTD>
                      {isDenied ? (
                        <span className="text-text-muted font-mono text-[13px]">-</span>
                      ) : item.checkOutTime ? (
                        <span className="text-success font-mono text-[13px] whitespace-nowrap">{item.checkOutTime}</span>
                      ) : (
                        <span className="text-secondary text-xs font-medium whitespace-nowrap">On Floor</span>
                      )}
                    </TableTD>

                    <TableTD>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${
                          isDenied ? "bg-card text-text-muted" : isQr ? "bg-primary/15 text-primary" : "bg-info/15 text-info"
                        }`}
                      >
                        {isQr ? <QrCode className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                        {isQr ? "QR App" : "RFID Key"}
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
              })}
            </TableBody>
          </Table>
        </Card>

        {isAdmin && (
          <Card className="flex min-w-0 flex-col gap-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-text-primary text-[16px] font-bold sm:text-[17px]">Transaction Summary</h3>
                <p className="text-text-muted text-[12px] sm:text-[13px]">Today's cash transaction activity &amp; settlement summary</p>
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
                {DUMMY_TRANSACTIONS.map((trx, index) => {
                  const isPending = trx.status === "PENDING"

                  return (
                    <TableTR
                      key={trx.id}
                      className={index % 2 === 0 ? "bg-transparent" : "bg-card/30"}
                    >
                      <TableTD>
                        <div className="flex flex-col">
                          <span className="text-text-primary text-[13.5px] font-bold whitespace-nowrap">{trx.memberName}</span>
                          <span className="text-primary/85 font-mono text-[11px]">{trx.trxCode}</span>
                        </div>
                      </TableTD>

                      <TableTD>
                        <span className="text-text-secondary text-[13px] whitespace-nowrap">{trx.type}</span>
                      </TableTD>

                      <TableTD>
                        <span className="text-text-primary font-mono text-[13px] font-bold whitespace-nowrap">{trx.amount}</span>
                      </TableTD>

                      <TableTD>
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${
                              isPending ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isPending ? "bg-warning" : "bg-success"}`} />
                            {isPending ? "Pending" : "Paid"}
                          </span>
                          <span className="text-text-muted font-mono text-[10.5px]">{trx.refCode}</span>
                        </div>
                      </TableTD>
                    </TableTR>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  )
}
