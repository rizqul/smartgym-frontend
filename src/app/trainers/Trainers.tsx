import { useState } from "react"
import { useNavigate } from "react-router"
import { UserPlus, Dumbbell, CalendarCheck, Timer, Wallet, TrendingUp, Calendar, Users } from "lucide-react"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
import TrainerListTab from "~/components/trainers/TrainerListTab"
import TrainerScheduleTab from "~/components/trainers/TrainerScheduleTab"

type TabType = "trainers" | "schedule"

export default function Trainers() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>("trainers")

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Data Trainer &amp; Manajemen Sesi PT</h2>
          <p className="text-text-muted text-[14px]">
            Direktori komprehensif instruktur gym, tiering kepelatihan, pembagian persentase komisi sesi, rekapitulasi performa bulanan, dan
            status payout komisi trainer.
          </p>
        </div>

        <div className="flex w-full sm:w-auto">
          <Button
            variant="primary"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => navigate("/dashboard/trainers/create")}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            Tambah Trainer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CardStats
          topIcon={<Dumbbell className="text-primary" />}
          bottomIcon={<TrendingUp className="text-primary" />}
          label="Total Trainer Terdaftar"
          subLabel="18 Full-Time • 6 Freelance"
          value={24}
        />
        <CardStats
          topIcon={<CalendarCheck className="text-amber-400" />}
          bottomIcon={<TrendingUp className="text-amber-400" />}
          label="Trainer Bertugas Hari Ini"
          subLabel="8 Shift Pagi • 8 Shift Sore"
          value={16}
        />
        <CardStats
          topIcon={<Timer className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Total Sesi Selesai (Bln Ini)"
          subLabel="Target: 350 Sesi (88.5%)"
          value={310}
        />
        <CardStats
          topIcon={<Wallet className="text-orange-400" />}
          bottomIcon={<TrendingUp className="text-orange-400" />}
          label="Komisi Akumulasi"
          subLabel="Rata-rata 35% Pool Share"
          value={"Rp 68.45 Jt" as unknown as number}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-1.5 rounded-xl border border-white/5 bg-[#1C1F26] p-3 sm:inline-flex sm:items-center justify-center">
        <Button
          type="button"
          onClick={() => setActiveTab("trainers")}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all sm:px-41 sm:py-2 sm:text-[13px] ${
            activeTab === "trainers" ? "bg-primary text-black shadow-md" : "text-text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span className="truncate">Daftar Trainer &amp; Komisi</span>
        </Button>

        <Button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all sm:px-41 sm:py-2 sm:text-[13px] ${
            activeTab === "schedule" ? "bg-primary text-black shadow-md" : "text-text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="truncate">Kalender &amp; Jadwal Sesi</span>
        </Button>
      </div>

      {activeTab === "trainers" ? <TrainerListTab onViewSchedule={() => setActiveTab("schedule")} /> : <TrainerScheduleTab />}
    </div>
  )
}
