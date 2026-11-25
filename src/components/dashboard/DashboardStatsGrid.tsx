import { Award, Dumbbell, ShieldCheck, TrendingUp, Users, Wallet } from "lucide-react"

import { CardStats } from "~/components/ui/CardStats"
import type { DashboardCountResponse } from "~/types/dashboard.type"
import { formatRupiah } from "~/utils/format"

interface DashboardStatsGridProps {
  stats?: DashboardCountResponse
  isAdmin: boolean
  currentYear: number
}

export default function DashboardStatsGrid({ stats, isAdmin, currentYear }: DashboardStatsGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${isAdmin ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
      <CardStats
        topIcon={<Users className="text-info" />}
        bottomIcon={<TrendingUp className="text-info" />}
        label="Total Members"
        subLabel="Registered"
        value={(stats?.allMember ?? 0).toLocaleString("id-ID")}
      />
      <CardStats
        topIcon={<Award className="text-secondary" />}
        bottomIcon={<TrendingUp className="text-secondary" />}
        label="Active Members"
        subLabel="Active Memberships"
        value={(stats?.activeMember ?? 0).toLocaleString("id-ID")}
      />
      <CardStats
        topIcon={<Dumbbell className="text-warning" />}
        bottomIcon={<TrendingUp className="text-warning" />}
        label="Total Trainers"
        subLabel="Personal Trainers"
        value={(stats?.totalTrainer ?? 0).toLocaleString("id-ID")}
      />
      <CardStats
        topIcon={<ShieldCheck className="text-success" />}
        bottomIcon={<TrendingUp className="text-success" />}
        label="Total Staff"
        subLabel="Operations Team"
        value={(stats?.staffCount ?? 0).toLocaleString("id-ID")}
      />
      {isAdmin && (
        <div className="sm:col-span-2 xl:col-span-1">
          <CardStats
            topIcon={<Wallet className="text-primary" />}
            bottomIcon={<TrendingUp className="text-primary" />}
            label={`Revenue (${currentYear})`}
            subLabel="Yearly Income"
            value={`Rp ${formatRupiah(stats?.incomeYearly ?? 0)}`}
          />
        </div>
      )}
    </div>
  )
}
