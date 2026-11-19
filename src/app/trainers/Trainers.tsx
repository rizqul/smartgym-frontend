import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { UserPlus, Dumbbell, CalendarCheck, Timer, Wallet, TrendingUp, Calendar, Users } from "lucide-react"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import TrainerListTab from "~/components/trainers/list/TrainerListTab"
import TrainerScheduleTab from "~/components/trainers/list/TrainerScheduleTab"
import { useGetAllTrainerQuery } from "~/services/trainer"
import { useAppSelector } from "~/store/hooks"

type TabType = "trainers" | "schedule"

export default function Trainers() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.user.data)
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  const [activeTab, setActiveTab] = useState<TabType>("trainers")
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | undefined>(undefined)

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data: trainersRes,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetAllTrainerQuery({
    name: debouncedSearch,
    page,
  })

  const trainers = trainersRes?.data ?? []

  const handleViewSchedule = (trainerId?: string) => {
    setSelectedTrainerId(trainerId)
    setActiveTab("schedule")
  }

  const handlePageChange = (url: string) => {
    const parsedUrl = new URL(url, window.location.origin)
    const nextPage = Number(parsedUrl.searchParams.get("page"))
    if (nextPage && nextPage !== page) {
      setPage(nextPage)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={4}
          contentVariant="list"
        />
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Data Trainer &amp; Manajemen Sesi PT</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Direktori komprehensif instruktur gym, tiering kepelatihan, pembagian persentase komisi sesi, rekapitulasi performa bulanan, dan
            status payout komisi trainer.
          </p>
        </div>

        {isAdmin && (
          <div className="flex w-full shrink-0 sm:w-auto">
            <Button
              variant="primary"
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={() => navigate("/dashboard/trainers/create")}
              className="w-full whitespace-nowrap sm:w-auto"
            >
              Tambah Trainer
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <div
        role="tablist"
        aria-label="Navigasi Trainer"
        className="grid w-full grid-cols-2 gap-2 rounded-xl border border-white/5 bg-[#1C1F26] p-2.5"
      >
        <Button
          type="button"
          role="tab"
          aria-selected={activeTab === "trainers"}
          variant={activeTab === "trainers" ? "primary" : "ghost"}
          onClick={() => setActiveTab("trainers")}
          leftIcon={<Users className="h-4 w-4 shrink-0" />}
          className={`w-full justify-center text-xs font-bold sm:text-[13px] ${
            activeTab === "trainers" ? "shadow-md" : "text-text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="truncate">Daftar Trainer &amp; Komisi</span>
        </Button>

        <Button
          type="button"
          role="tab"
          aria-selected={activeTab === "schedule"}
          variant={activeTab === "schedule" ? "primary" : "ghost"}
          onClick={() => setActiveTab("schedule")}
          leftIcon={<Calendar className="h-4 w-4 shrink-0" />}
          className={`w-full justify-center text-xs font-bold sm:text-[13px] ${
            activeTab === "schedule" ? "shadow-md" : "text-text-muted hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="truncate">Kalender &amp; Jadwal Sesi</span>
        </Button>
      </div>

      {activeTab === "trainers" ? (
        <TrainerListTab
          trainers={trainers}
          pagination={trainersRes?.paginate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPageChange={handlePageChange}
          isFetching={isFetching}
          isError={isError}
          onRefetch={refetch}
          onViewSchedule={handleViewSchedule}
          isAdmin={isAdmin}
        />
      ) : (
        <TrainerScheduleTab
          trainers={trainers}
          initialTrainerId={selectedTrainerId}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}
