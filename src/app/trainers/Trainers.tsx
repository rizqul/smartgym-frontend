import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { UserPlus, Dumbbell, Wallet, Calendar, CalendarCheck, CalendarClock, Users, Trash2, X, Whistle, LayoutGrid, ListChecks, Banknote } from "lucide-react"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import TrainerListTab from "~/components/trainers/list/TrainerListTab"
import TrainerScheduleTab from "~/components/trainers/list/TrainerScheduleTab"
import { useGetAllTrainerQuery, useGetTrainerCountQuery } from "~/services/trainer"
import { useAppSelector } from "~/store/hooks"
import { formatRupiah } from "~/utils/format"
import type { TrainerItem } from "~/types/trainer"

type TabType = "trainers" | "schedule"

export default function Trainers() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.user.data)
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  const [activeTab, setActiveTab] = useState<TabType>("trainers")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [trainerToDelete, setTrainerToDelete] = useState<TrainerItem | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: countRes, isLoading: isLoadingCount } = useGetTrainerCountQuery()
  const {
    data: trainersRes,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetAllTrainerQuery({
    name: debouncedSearch,
    page
  })

  const trainers = trainersRes?.data ?? []
  const trainerStats = countRes?.data

  const handlePageChange = (url: string) => {
    const parsedUrl = new URL(url, window.location.origin)
    const nextPage = Number(parsedUrl.searchParams.get("page"))
    if (nextPage && nextPage !== page) {
      setPage(nextPage)
    }
  }

  if (isLoading || isLoadingCount) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={isAdmin ? 4 : 3}
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
            Kelola direktori Personal Trainer, spesialisasi keahlian, tarif per sesi, serta jadwal ketersediaan slot reservasi member.
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

      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${isAdmin ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
        <CardStats
          topIcon={<Dumbbell className="text-primary" />}
          bottomIcon={<Whistle className="text-primary" />}
          label="Total Trainer"
          subLabel="Terdaftar di SmartGym"
          value={trainerStats?.countTrainer ?? 0}
        />
        <CardStats
          topIcon={<CalendarCheck className="text-amber-400" />}
          bottomIcon={<LayoutGrid className="text-amber-400" />}
          label="Trainer Bertugas"
          subLabel="Memiliki slot hari ini"
          value={trainerStats?.countTrainerWithSlot ?? 0}
        />
        <CardStats
          topIcon={<CalendarClock className="text-blue-400" />}
          bottomIcon={<ListChecks className="text-blue-400" />}
          label="Total Slot Hari Ini"
          subLabel="Jadwal sesi tersedia"
          value={trainerStats?.countSlot ?? 0}
        />
        {isAdmin && (
          <CardStats
            topIcon={<Wallet className="text-emerald-400" />}
            bottomIcon={<Banknote className="text-emerald-400" />}
            label="Pendapatan Sesi PT"
            subLabel="Akumulasi booking trainer"
            value={`Rp ${formatRupiah(trainerStats?.sumTransactionBookedTrainer ?? 0)}`}
          />
        )}
      </div>

      <div
        role="tablist"
        aria-label="Navigasi Trainer"
        className="grid w-full grid-cols-2 gap-2 rounded-xl border border-white/5 bg-[#1C1F26] p-2"
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
          <span className="truncate">Daftar Trainer</span>
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
          onDelete={(trainer) => setTrainerToDelete(trainer)}
          isAdmin={isAdmin}
        />
      ) : (
        <TrainerScheduleTab
          trainers={trainers}
          isAdmin={isAdmin}
        />
      )}

      {trainerToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm lg:left-64"
          // onClick={() => !isDeleting && setTrainerToDelete(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#16181D] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                  <Trash2 className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-white">Hapus Trainer</h3>
              </div>
              <button
                type="button"
                onClick={() => setTrainerToDelete(null)}
                // disabled={isDeleting}
                aria-label="Tutup modal"
                className="text-text-muted cursor-pointer rounded-lg p-1 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 text-sm leading-relaxed text-white/80">
              Apakah kamu yakin ingin menghapus trainer <strong className="text-white">{trainerToDelete.name}</strong>? Tindakan ini tidak
              dapat dibatalkan.
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-white/5 bg-[#121419] px-5 py-3.5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTrainerToDelete(null)}
                // disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="primary"
                // isLoading={isDeleting}
                // onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {/* {isDeleting ? "Menghapus..." : "Ya, Hapus"} */}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
