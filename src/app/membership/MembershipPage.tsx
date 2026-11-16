import { useNavigate } from "react-router"
import { Layers, Users, Clock, TrendingUp, Plus, CheckCircle2, Edit, Trash } from "lucide-react"

import { Button } from "../../components/ui/Button"
import { CardStats } from "../../components/ui/CardStats"

import { MOCK_PACKAGES } from "../../data/mockMembership"
import Badge from "~/components/ui/Badge"

export default function MembershipPage() {
  const navigate = useNavigate()

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Membership</h2>
          <p className="text-text-muted text-[14px]">
            Kelola katalog paket membership (Daily, Monthly, Quarterly, Semiannual, Annual) dan pantau status langganan member terdaftar
            secara real-time.
          </p>
        </div>

        <div className="flex shrink-0 gap-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/dashboard/membership/create")}
          >
            Tambah Paket Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CardStats
          topIcon={<Layers className="text-white" />}
          bottomIcon={<TrendingUp className="text-white" />}
          label="Katalog Aktif"
          subLabel="100% Online"
          value={5}
        />
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Langganan Berjalan"
          subLabel="+6.4% MoM"
          value={2350}
        />
        <CardStats
          topIcon={<Clock className="text-red-400" />}
          bottomIcon={<TrendingUp className="text-red-400" />}
          label="Segera Kedaluwarsa"
          subLabel="Members"
          value={48}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="flex h-full flex-col rounded-xl border border-white/10 bg-[#1C1F26] p-6 shadow-lg transition-all hover:border-white/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <Badge label={pkg.tier} />
              <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-400">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Active
              </div>
            </div>

            <div className="mb-6 flex flex-col gap-1.5">
              <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
              <p className="text-text-secondary text-[13px]">{pkg.description}</p>
            </div>

            <div className="mb-6 flex flex-col gap-1">
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-[14px] font-semibold">Rp</span>
                <span className="text-3xl font-bold tracking-tight">{pkg.price}</span>
                <span className="text-text-muted text-[13px]">{pkg.period}</span>
              </div>
              <span className="text-primary text-[12px] font-medium">{pkg.activeLabel}</span>
            </div>

            <div className="mb-8 flex flex-col gap-3">
              <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">FASILITAS TERMASUK</span>
              <ul className="flex flex-col gap-2.5">
                {pkg.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] text-white/90"
                  >
                    <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-white">{pkg.memberCount}</span>
                <span className="text-text-muted text-[11px]">{pkg.memberLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/dashboard/membership/${pkg.id}/edit`)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Paket
                </button>
                <button className="text-text-muted flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5 hover:text-white">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
