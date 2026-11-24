import { useState } from "react"
import { ChevronDown, Clock, FileText, Loader2, Plus, RotateCcw, X } from "lucide-react"

import { Button } from "~/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/Card"
import LocalDate from "~/components/ui/LocalDate"
import { useGetTrainerSlotsQuery } from "~/services/trainer"
import { getAvatarUrl } from "~/utils/avatar"
import type { TrainerItem, TrainerSlotItem } from "~/types/trainer"
import { formatDateValue, getSlotStatusBadgeStyle } from "../../../utils/scheduleHelpers"

interface TrainerSlotDetailPanelProps {
  trainer: TrainerItem
  selectedSlot?: TrainerSlotItem | null
  selectedDate: string
  isAdmin: boolean
  variant: "sidebar" | "bottom"
  onClose: () => void
  onOpenCreateModal: (trainerId: string) => void
}

export default function TrainerSlotDetailPanel({
  trainer,
  selectedSlot,
  selectedDate,
  isAdmin,
  variant,
  onClose,
  onOpenCreateModal
}: TrainerSlotDetailPanelProps) {
  const { currentData, isFetching, isError, refetch } = useGetTrainerSlotsQuery({
    trainerId: trainer.id,
    date: selectedDate
  })

  const slots = currentData?.data ?? []
  const isInitialDateLoad = isFetching && !currentData
  const isToday = selectedDate === formatDateValue(new Date())

  const selectionKey = `${trainer.id}|${selectedDate}|${selectedSlot?.id ?? ""}`
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey)
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>(selectedSlot?.id ?? null)

  if (selectionKey !== prevSelectionKey) {
    setPrevSelectionKey(selectionKey)
    setExpandedSlotId(selectedSlot?.id ?? null)
  }

  const toggleNote = (slotId: string) => {
    setExpandedSlotId((prev) => (prev === slotId ? null : slotId))
  }

  const renderSlotList = (maxHeightClass: string) => {
    if (isInitialDateLoad) {
      return (
        <div className="text-text-muted flex items-center justify-center gap-2 py-6 text-xs">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading slots...
        </div>
      )
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <span className="text-xs text-red-400">Failed to load schedule slots.</span>
          <Button
            type="button"
            variant="secondary"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={refetch}
          >
            Try Again
          </Button>
        </div>
      )
    }

    if (!slots.length) {
      return (
        <div className="text-text-muted rounded-xl border border-dashed border-white/10 bg-[#0B0C10]/50 p-4 text-center text-xs">
          No slots scheduled for this date.
        </div>
      )
    }

    return (
      <div
        className={`flex flex-col gap-2 overflow-y-auto pr-1 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"} ${maxHeightClass}`}
      >
        {slots.map((slot) => {
          const hasDescription = Boolean(slot.description?.trim())
          const isExpanded = expandedSlotId === slot.id
          const isHighlighted = selectedSlot?.id === slot.id

          return (
            <div
              key={slot.id}
              className={`rounded-xl border p-3 transition-colors ${
                isHighlighted ? "border-primary/50 bg-primary/10" : "border-white/5 bg-[#0B0C10]/80 hover:border-white/15"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Clock className="text-primary h-3.5 w-3.5 shrink-0" />
                  <LocalDate
                    date={slot.startTime}
                    variant="hour"
                  />
                  <span className="text-text-muted">-</span>
                  <LocalDate
                    date={slot.endTime}
                    variant="hour"
                  />
                </div>

                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${getSlotStatusBadgeStyle(slot.status)}`}>
                  {slot.status}
                </span>
              </div>

              {hasDescription && (
                <div className="mt-2 border-t border-white/5 pt-2">
                  <button
                    type="button"
                    onClick={() => toggleNote(slot.id)}
                    className="text-text-muted flex w-full cursor-pointer items-center justify-between text-[11px] font-medium transition-colors hover:text-white"
                  >
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3 w-3 text-sky-400" />
                      Session Notes
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  {isExpanded && (
                    <p className="mt-1.5 rounded-lg bg-white/3 p-2 text-xs leading-relaxed text-white/85">{slot.description}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <Card className="hidden flex-col xl:sticky xl:top-6 xl:col-span-4 xl:flex">
        <CardHeader className="border-b border-white/5 p-5 pb-3 sm:p-5 sm:pb-3">
          <div className="flex items-center justify-between">
            <span className="text-text-muted inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
              <FileText className="h-3.5 w-3.5" />
              SCHEDULE DETAILS
            </span>
            <div className="flex items-center gap-2">
              <LocalDate
                date={selectedDate}
                variant="short"
                className="text-text-muted rounded-md bg-white/5 px-2 py-0.5 text-[10px]"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close schedule details"
                className="text-text-muted cursor-pointer rounded-md p-1 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-5 sm:p-5">
          <div className="flex items-center gap-3 pt-3">
            <img
              src={getAvatarUrl(trainer.name, trainer.profileUrl)}
              alt={trainer.name}
              className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover"
            />
            <div className="min-w-0">
              <h4 className="truncate text-base font-bold text-white">{trainer.name}</h4>
              <p className="text-primary truncate text-xs font-medium uppercase">{trainer.specialization?.replace(/_/g, " ") || "-"}</p>
              <div className="text-text-muted mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 text-amber-300">{trainer.experience ?? 0} years of experience</span>
                <span>•</span>
                <span>{trainer.phoneNumber || trainer.email || "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">
                {isToday ? "ALL SLOTS TODAY" : "SCHEDULED SLOTS"}
              </span>
              <span className="text-xs font-semibold text-sky-400">{isInitialDateLoad ? "..." : `${slots.length} Sessions`}</span>
            </div>

            {renderSlotList("max-h-80")}
          </div>
        </CardContent>

        {isAdmin && (
          <CardFooter className="p-5 pt-0 sm:p-5 sm:pt-0">
            <Button
              type="button"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => onOpenCreateModal(trainer.id)}
              className="w-full justify-center"
            >
              Add Slot for {trainer.name.split(" ")[0]}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <div className="sticky bottom-4 z-30 rounded-2xl border border-white/10 bg-[#161920]/95 p-4 shadow-2xl backdrop-blur-md xl:hidden">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={getAvatarUrl(trainer.name, trainer.profileUrl)}
              alt={trainer.name}
              className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="truncate text-sm font-bold text-white">{trainer.name}</h4>
                <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  {trainer.experience ?? 0} years of experience
                </span>
              </div>
              <p className="text-text-muted mt-0.5 text-xs">
                Total <strong className="text-white">{isInitialDateLoad ? "..." : `${slots.length} slots`}</strong> on{" "}
                <LocalDate
                  date={selectedDate}
                  variant="short"
                />
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close schedule details"
            className="text-text-muted shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {renderSlotList("max-h-48")}

        {isAdmin && (
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => onOpenCreateModal(trainer.id)}
            className="w-full justify-center"
          >
            Add Slot for {trainer.name.split(" ")[0]}
          </Button>
        )}
      </div>
    </div>
  )
}
