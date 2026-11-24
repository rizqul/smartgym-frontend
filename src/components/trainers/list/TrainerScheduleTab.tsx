import { useMemo, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Users, X } from "lucide-react"
import toast from "react-hot-toast"

import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { Card } from "~/components/ui/Card"
import LocalDate from "~/components/ui/LocalDate"
import type { CreateTrainerSlotRequest, TrainerItem, TrainerSlotItem } from "~/types/trainer"
import { useCreateTrainerSlotMutation } from "~/services/trainer"
import CreateTrainerSlotModal from "../schedule/CreateTrainerSlotModal"
import TrainerScheduleCard from "../schedule/TrainerScheduleCard"
import TrainerSlotDetailPanel from "../schedule/TrainerSlotDetailPanel"
import { formatDateValue } from "../../../utils/scheduleHelpers"

interface TrainerScheduleTabProps {
  trainers: TrainerItem[]
  initialTrainerId?: string
  isAdmin?: boolean
}

export default function TrainerScheduleTab({ trainers, initialTrainerId, isAdmin = true }: TrainerScheduleTabProps) {
  const todayStr = formatDateValue(new Date())

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [searchTrainer, setSearchTrainer] = useState("")
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(initialTrainerId || "")
  const [selectedSlot, setSelectedSlot] = useState<TrainerSlotItem | null>(null)
  const [modalTrainerId, setModalTrainerId] = useState<string | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [prevInitialTrainerId, setPrevInitialTrainerId] = useState(initialTrainerId)
  if (initialTrainerId !== prevInitialTrainerId) {
    setPrevInitialTrainerId(initialTrainerId)
    if (initialTrainerId) setSelectedTrainerId(initialTrainerId)
  }

  const [createTrainerSlot, { isLoading: isCreatingSlot }] = useCreateTrainerSlotMutation()

  const hasSearch = searchTrainer.trim().length > 0
  const isToday = selectedDate === todayStr

  const filteredTrainers = useMemo(() => {
    const keyword = searchTrainer.trim().toLowerCase()
    if (!keyword) return trainers
    return trainers.filter(
      (t) => t.name.toLowerCase().includes(keyword) || (t.specialization?.toLowerCase().replace(/_/g, " ") ?? "").includes(keyword)
    )
  }, [trainers, searchTrainer])

  const activeTrainer = useMemo(() => trainers.find((t) => t.id === selectedTrainerId), [trainers, selectedTrainerId])
  const hasSelectedDetail = Boolean(activeTrainer)

  const handleDateChange = (nextDate: string) => {
    if (!nextDate || nextDate === selectedDate) return
    setSelectedDate(nextDate)
    setSelectedSlot(null)
  }

  const handleShiftDate = (days: number) => {
    const current = new Date(`${selectedDate}T00:00:00`)
    current.setDate(current.getDate() + days)
    handleDateChange(formatDateValue(current))
  }

  const handleToday = () => handleDateChange(todayStr)

  const handleCloseDetail = () => {
    setSelectedTrainerId("")
    setSelectedSlot(null)
  }

  const handleOpenCreateModal = (trainerId?: string) => {
    setModalTrainerId(trainerId || activeTrainer?.id || trainers[0]?.id)
    setIsModalOpen(true)
  }

  const handleCreateSlot = async (payload: CreateTrainerSlotRequest) => {
    try {
      await createTrainerSlot(payload).unwrap()
      setSelectedTrainerId(payload.trainerId)
      handleDateChange(payload.slotDate)
      setIsModalOpen(false)
      toast.success("Trainer schedule added successfully!")
    } catch (error: unknown) {
      const apiErr = error as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Failed to add trainer schedule.")
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3.5 p-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-xl border border-white/10 bg-[#0B0C10] p-1">
              <button
                type="button"
                onClick={() => handleShiftDate(-1)}
                aria-label="Previous day"
                className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  isToday ? "bg-primary/15 text-primary" : "text-white hover:bg-white/5"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleShiftDate(1)}
                aria-label="Next day"
                className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-1">
              <Calendar className="text-primary h-4 w-4 shrink-0" />
              <LocalDate
                date={selectedDate}
                variant="long"
                className="text-sm font-bold text-white"
              />
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              aria-label="Select date"
              className="focus:border-primary rounded-xl border border-white/10 bg-[#0B0C10] px-3 py-1.5 text-xs text-white scheme-dark focus:outline-none"
            />
          </div>

          {isAdmin && (
            <Button
              type="button"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => handleOpenCreateModal(activeTrainer?.id)}
              disabled={!trainers.length}
              className="w-full shrink-0 sm:w-auto"
            >
              Add Schedule Slot
            </Button>
          )}
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-white/5 pt-3.5 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-xs">
            <Input
              type="text"
              icon={Search}
              placeholder="Search trainer name or specialization..."
              value={searchTrainer}
              onChange={(e) => setSearchTrainer(e.target.value)}
              className="py-2 text-[13px]"
              rightElement={
                hasSearch ? (
                  <button
                    type="button"
                    onClick={() => setSearchTrainer("")}
                    aria-label="Clear search"
                    className="text-text-muted cursor-pointer rounded-md p-0.5 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : undefined
              }
            />
          </div>

          <div className="text-text-muted flex flex-wrap items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Booked
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <Card className={`flex flex-col gap-4 bg-[#1C1F26]/60 p-4 sm:p-5 ${hasSelectedDetail ? "xl:col-span-8" : "xl:col-span-12"}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white sm:text-[15px]">
              <Users className="text-primary h-4 w-4" />
              <span>
                Trainers on Duty (
                <LocalDate
                  date={selectedDate}
                  variant="short"
                />
                )
              </span>
            </h3>
            <span className="text-text-muted text-xs">{filteredTrainers.length} Trainers Shown</span>
          </div>

          {!filteredTrainers.length ? (
            <div className="text-text-muted flex min-h-60 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 text-sm">
              <span>No trainers found</span>
              {hasSearch && (
                <Button
                  variant="secondary"
                  onClick={() => setSearchTrainer("")}
                >
                  Reset Search
                </Button>
              )}
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${hasSelectedDetail ? "" : "xl:grid-cols-3"}`}>
              {filteredTrainers.map((trainer) => (
                <TrainerScheduleCard
                  key={trainer.id}
                  trainer={trainer}
                  selectedDate={selectedDate}
                  isSelected={activeTrainer?.id === trainer.id}
                  selectedSlotId={selectedSlot?.id}
                  isAdmin={isAdmin}
                  onSelectTrainer={(t, firstSlot) => {
                    setSelectedTrainerId(t.id)
                    setSelectedSlot(firstSlot ?? null)
                  }}
                  onSelectSlot={(t, slot) => {
                    setSelectedTrainerId(t.id)
                    setSelectedSlot(slot)
                  }}
                  onOpenCreateModal={(id) => handleOpenCreateModal(id)}
                />
              ))}
            </div>
          )}
        </Card>

        {activeTrainer && (
          <TrainerSlotDetailPanel
            variant="sidebar"
            trainer={activeTrainer}
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            isAdmin={isAdmin}
            onClose={handleCloseDetail}
            onOpenCreateModal={handleOpenCreateModal}
          />
        )}
      </div>

      {activeTrainer && (
        <TrainerSlotDetailPanel
          variant="bottom"
          trainer={activeTrainer}
          selectedSlot={selectedSlot}
          selectedDate={selectedDate}
          isAdmin={isAdmin}
          onClose={handleCloseDetail}
          onOpenCreateModal={handleOpenCreateModal}
        />
      )}

      {isAdmin && (
        <CreateTrainerSlotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          trainers={trainers}
          defaultTrainerId={modalTrainerId ?? activeTrainer?.id}
          defaultDate={selectedDate}
          isSubmitting={isCreatingSlot}
          onSubmit={handleCreateSlot}
        />
      )}
    </div>
  )
}
