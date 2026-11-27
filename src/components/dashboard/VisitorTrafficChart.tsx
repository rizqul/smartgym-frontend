import { useMemo } from "react"
import { Activity } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card } from "~/components/ui/Card"
import type { AttendanceHourlySlot } from "~/types/dashboard.type"

interface VisitorChartPoint {
  hour: string
  today: number
  lastWeek: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey?: string
    value?: number
  }>
  label?: string
}

interface VisitorTrafficChartProps {
  date?: string
  slots: AttendanceHourlySlot[]
}

function VisitorTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const todayVal = payload.find((p) => p.dataKey === "today")?.value ?? 0
  const lastWeekVal = payload.find((p) => p.dataKey === "lastWeek")?.value ?? 0

  return (
    <div className="bg-background border-border rounded-xl border px-3.5 py-2.5 shadow-xl">
      <p className="text-text-muted text-[10px] font-bold tracking-wider uppercase">HOUR {label}</p>
      <p className="text-primary mt-1 text-[12px] font-semibold">
        Today: <span className="text-text-primary">{todayVal} People</span>
      </p>
      <p className="text-info text-[12px] font-semibold">
        Last Week: <span className="text-text-primary">{lastWeekVal} People</span>
      </p>
    </div>
  )
}

export default function VisitorTrafficChart({ date, slots }: VisitorTrafficChartProps) {
  const chartData: VisitorChartPoint[] = useMemo(() => {
    return slots.map((slot) => ({
      hour: slot.label,
      today: slot.todayCount,
      lastWeek: slot.lastWeekCount
    }))
  }, [slots])

  const todayTotalCheckins = useMemo(() => chartData.reduce((acc, item) => acc + item.today, 0), [chartData])
  const lastWeekTotalCheckins = useMemo(() => chartData.reduce((acc, item) => acc + item.lastWeek, 0), [chartData])

  const peakSlot = useMemo(() => {
    if (!chartData.length) return { hour: "-", today: 0 }
    return chartData.reduce((max, curr) => (curr.today > max.today ? curr : max), chartData[0])
  }, [chartData])

  return (
    <Card className="flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-text-primary text-base font-bold sm:text-lg">Daily Visitor Traffic</h2>
            <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold">
              <Activity className="h-3.5 w-3.5" />
              Live Gate Data
            </span>
          </div>
          <p className="text-text-muted text-[12px] sm:text-[13px]">
            2-hour visitor check-in trends {date ? `(${date})` : ""} compared with last week
          </p>
        </div>

        <div className="border-border/60 bg-background/60 flex flex-wrap items-center gap-4 rounded-xl border px-4 py-2.5">
          <div className="flex flex-col">
            <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">LAST WEEK TOTAL</span>
            <span className="text-text-primary text-sm font-bold">{lastWeekTotalCheckins} Check-ins</span>
          </div>
          <div className="bg-border h-7 w-px" />
          <div className="flex flex-col">
            <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">PEAK HOUR</span>
            <span className="text-primary text-sm font-bold">{peakSlot.hour}</span>
          </div>
        </div>
      </div>

      <div className="border-border/50 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-[12px]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-text-primary flex items-center gap-2">
            <span className="bg-primary h-2.5 w-2.5 rounded-sm" />
            <span>Today&apos;s Visitors ({todayTotalCheckins} Check-ins)</span>
          </div>
          <div className="text-text-secondary flex items-center gap-2">
            <span className="bg-info h-2.5 w-2.5 rounded-sm" />
            <span>Same Day Last Week</span>
          </div>
        </div>
        <div className="text-text-muted text-[12px]">
          Peak Load: <strong className="text-secondary">{peakSlot.today} People</strong> <span className="text-border">|</span>{" "}
          <strong className="text-text-primary">{peakSlot.hour}</strong>
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={chartData}
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
                id="lastWeekAreaGrad"
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
              allowDecimals={false}
            />
            <Tooltip
              content={<VisitorTooltip />}
              cursor={{ stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            <Area
              type="monotone"
              dataKey="lastWeek"
              stroke="var(--color-info)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#lastWeekAreaGrad)"
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
  )
}
