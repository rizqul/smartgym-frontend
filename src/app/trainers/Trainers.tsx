import { useState } from "react"
import { useNavigate } from "react-router"
import {
  UserPlus,
  Dumbbell,
  Wallet,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Users,
  Whistle,
  LayoutGrid,
  ListChecks,
  Banknote
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import TrainerListTab from "~/components/trainers/list/TrainerListTab"
import TrainerScheduleTab from "~/components/trainers/list/TrainerScheduleTab"
import { useDebounce } from "~/hooks/useDebounce"
import { usePagination } from "~/hooks/usePagination"
import { useDeleteTrainerMutation, useGetAllTrainerQuery, useGetTrainerCountQuery } from "~/services/trainer.service"
import { useAppSelector } from "~/store/hooks"
import { Alert } from "~/utils/alert"
import { formatRupiah } from "~/utils/format"
import type { TrainerItem } from "~/types/trainer.type"

type TabType = "trainers" | "schedule"

export default function Trainers() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.user.data)
  const isAdmin = user?.role?.toUpperCase() === "ADMIN"

  const [activeTab, setActiveTab] = useState<TabType>("trainers")
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { page, size, handlePageChange, handlePageSizeChange, resetPage } = usePagination(5)

  const debouncedSearch = useDebounce(searchQuery, 500)
  const trimmedSearch = debouncedSearch.trim()
  const isDebouncing = searchQuery.trim() !== trimmedSearch

  const [prevSearch, setPrevSearch] = useState(trimmedSearch)
  if (trimmedSearch !== prevSearch) {
    setPrevSearch(trimmedSearch)
    resetPage()
  }

  const effectivePage = trimmedSearch !== prevSearch ? 1 : page

  const { data: countRes } = useGetTrainerCountQuery()

  const {
    data: trainersRes,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetAllTrainerQuery({
    search: trimmedSearch || undefined,
    page: effectivePage,
    size
  })

  const { data: scheduleTrainersRes } = useGetAllTrainerQuery({ page: 1, size: 50 }, { skip: activeTab !== "schedule" })

  const [deleteTrainer] = useDeleteTrainerMutation()

  const trainers = trainersRes?.data ?? []
  const scheduleTrainers = scheduleTrainersRes?.data ?? trainers
  const trainerStats = countRes?.data
  const isTableUpdating = isFetching || isDebouncing

  const handleDelete = async (trainer: TrainerItem) => {
    const result = await Alert.confirm({
      title: "Delete Trainer?",
      text: `Are you sure you want to delete trainer "${trainer.name}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      isDanger: true
    })

    if (!result.isConfirmed) return

    setDeletingId(trainer.id)
    try {
      await deleteTrainer(trainer.id).unwrap()
      toast.success(`Trainer ${trainer.name} deleted successfully!`)
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message || "Failed to delete trainer."
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading && !trainersRes) {
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
          <h2 className="text-xl font-bold text-white sm:text-2xl">Trainer Data &amp; Session Management</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Manage the Personal Trainer directory, areas of expertise, session rates, and member reservation slot availability.
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
              Add Trainer
            </Button>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${isAdmin ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
        <CardStats
          topIcon={<Dumbbell className="text-primary" />}
          bottomIcon={<Whistle className="text-primary" />}
          label="Total Trainers"
          subLabel="Registered"
          value={trainerStats?.countTrainer ?? 0}
        />
        <CardStats
          topIcon={<CalendarCheck className="text-amber-400" />}
          bottomIcon={<LayoutGrid className="text-amber-400" />}
          label="Trainers on Duty"
          subLabel="Today"
          value={trainerStats?.countTrainerWithSlot ?? 0}
        />
        <CardStats
          topIcon={<CalendarClock className="text-blue-400" />}
          bottomIcon={<ListChecks className="text-blue-400" />}
          label="Total Slots Today"
          subLabel="Sessions available"
          value={trainerStats?.countSlot ?? 0}
        />
        {isAdmin && (
          <CardStats
            topIcon={<Wallet className="text-emerald-400" />}
            bottomIcon={<Banknote className="text-emerald-400" />}
            label="Trainer Revenue"
            subLabel="Accumulated"
            value={`Rp ${formatRupiah(trainerStats?.sumTransactionBookedTrainer ?? 0)}`}
          />
        )}
      </div>

      <div
        role="tablist"
        aria-label="Trainer navigation"
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
          <span className="truncate">Trainer List</span>
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
          <span className="truncate">Calendar &amp; Session Schedule</span>
        </Button>
      </div>

      {activeTab === "trainers" ? (
        <TrainerListTab
          trainers={trainers}
          pagination={trainersRes?.paginate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isFetching={isTableUpdating}
          isError={isError}
          onRefetch={refetch}
          onEdit={(trainer) => navigate(`/dashboard/trainers/${trainer.id}/edit`, { state: { trainer } })}
          onDelete={handleDelete}
          deletingId={deletingId}
          isAdmin={isAdmin}
        />
      ) : (
        <TrainerScheduleTab
          trainers={scheduleTrainers}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}
