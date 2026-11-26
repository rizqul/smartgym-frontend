import { Briefcase, Clock, Loader2, Phone, Plus, RotateCcw } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/Card"
import LocalDate from "~/components/ui/LocalDate"
import { getAvatarUrl } from "~/utils/avatar"
import { useGetTrainerSlotsQuery } from "~/services/trainer.service"
import type { TrainerItem, TrainerSlotItem } from "~/types/trainer.type"
import { formatDateValue, getSlotStatusBadgeStyle } from "../../../utils/scheduleHelpers"

const MAX_VISIBLE_SLOTS = 3

interface TrainerScheduleCardProps {
  trainer: TrainerItem
  selectedDate: string
  isSelected: boolean
  isAdmin: boolean
  onSelectTrainer: (trainer: TrainerItem, firstSlot?: TrainerSlotItem) => void
  onOpenCreateModal: (trainerId: string) => void
}

export default function TrainerScheduleCard({
  trainer,
  selectedDate,
  isSelected,
  isAdmin,
  onSelectTrainer,
  onOpenCreateModal
}: TrainerScheduleCardProps) {
  const { currentData, isFetching, isError, refetch } = useGetTrainerSlotsQuery({
    trainerId: trainer.id,
    date: selectedDate
  })

  const slots = currentData?.data ?? []
  const isInitialDateLoad = isFetching && !currentData
  const isToday = selectedDate === formatDateValue(new Date())
  const visibleSlots = slots.slice(0, MAX_VISIBLE_SLOTS)
  const remainingSlotsCount = Math.max(0, slots.length - MAX_VISIBLE_SLOTS)

  return (
    <Card
      onClick={() => onSelectTrainer(trainer, slots[0])}
      className={`flex h-100 cursor-pointer flex-col justify-between transition-all ${
        isSelected
          ? "border-primary shadow-[0_0_0_1px_rgba(255,107,0,0.25)]"
          : "bg-[#161920] shadow-none hover:border-white/15 hover:bg-[#1C1F26]/80"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="space-y-3 p-4 pb-3 sm:p-4 sm:pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={getAvatarUrl(trainer.name, trainer.profileUrl)}
                alt={trainer.name}
                className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
              />
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-white">{trainer.name}</h4>
                <p className="text-text-muted truncate text-[11px] uppercase">{trainer.specialization?.replace(/_/g, " ") || "-"}</p>
              </div>
            </div>

            {isSelected && <span className="bg-primary shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold text-black">Selected</span>}
          </div>

          <div className="text-text-muted flex flex-wrap items-center gap-2 border-b border-white/5 pb-3 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-300">
              <Briefcase className="h-3 w-3" />
              {trainer.experience ?? 0} Years of Experience
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3 text-sky-400" />
              {trainer.phoneNumber || "-"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4 pt-0 sm:p-4 sm:pt-0">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
              {isToday ? "TODAY'S SESSION SCHEDULE" : "SESSION SCHEDULE"}
            </span>
            <span className="text-text-muted inline-flex items-center gap-1 text-[10px] font-medium">
              <Clock className="text-primary h-3 w-3" />
              {isInitialDateLoad ? "..." : `${slots.length} Sessions`}
            </span>
          </div>

          {isInitialDateLoad ? (
            <div className="text-text-muted flex flex-1 items-center justify-center gap-2 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading schedule...
            </div>
          ) : isError ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 text-center">
              <span className="text-[11px] text-red-400">Failed to load slots</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  refetch()
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" />
                Retry
              </button>
            </div>
          ) : !slots.length ? (
            <div className="text-text-muted flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-[#0B0C10]/40 px-3 text-center text-[11px]">
              <span>No slots available on this date</span>
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenCreateModal(trainer.id)
                  }}
                  className="text-primary inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors hover:bg-white/5"
                >
                  <Plus className="h-3 w-3" />
                  Add Slot
                </button>
              )}
            </div>
          ) : (
            <div className={`flex flex-col gap-1.5 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
              {visibleSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/5 bg-[#0B0C10]/70 px-2.5 py-2 text-white/85"
                >
                  <div className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-white">
                    <Clock className="text-primary h-3.5 w-3.5 shrink-0" />
                    <span className="shrink-0 tabular-nums">
                      <LocalDate
                        date={slot.startTime}
                        variant="hour"
                      />
                      <span className="text-text-muted mx-1">-</span>
                      <LocalDate
                        date={slot.endTime}
                        variant="hour"
                      />
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${getSlotStatusBadgeStyle(
                      slot.status
                    )}`}
                  >
                    {slot.status}
                  </span>
                </div>
              ))}

              {remainingSlotsCount > 0 && (
                <div className="text-text-muted flex justify-center pt-0.5 text-[11px] font-medium">
                  <span>+{remainingSlotsCount} more slots</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="border-t border-white/5 p-2 pt-3 text-[11px] sm:pt-3">
        <span className="text-text-muted text-[10px]">Click to view details</span>
      </CardFooter>
    </Card>
  )
}
