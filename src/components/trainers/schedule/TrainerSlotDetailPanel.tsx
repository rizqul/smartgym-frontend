import { Clock, FileText, Loader2, Plus, RotateCcw, X } from "lucide-react"

import { Button } from "~/components/ui/Button"
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

  const renderSlotList = () => {
    if (isInitialDateLoad) {
      return (
        <div className="text-text-muted flex items-center justify-center gap-2 py-6 text-xs">
          <Loader2 className="text-primary h-4 w-4 animate-spin" />
          Loading slots...
        </div>
      )
    }

    if (isError) {
      return (
        <div className="border-danger/25 bg-danger/10 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center">
          <span className="text-danger text-xs">Failed to load schedule slots.</span>
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
        <div className="border-border bg-surface text-text-muted rounded-xl border border-dashed p-5 text-center text-xs">
          No slots scheduled for this date.
        </div>
      )
    }

    return (
      <div className={`flex flex-col gap-2 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
        {slots.map((slot) => {
          const description = slot.description?.trim()
          const isHighlighted = selectedSlot?.id === slot.id

          return (
            <div
              key={slot.id}
              className={`relative flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-all ${
                isHighlighted
                  ? "border-primary/60 shadow-overlay/40 bg-background/60 pl-4 shadow-md"
                  : "border-border/60 bg-surface hover:border-border"
              }`}
            >
              {isHighlighted && <span className="bg-primary absolute inset-y-2 left-1.5 w-1 rounded-full" />}

              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="text-text-primary flex shrink-0 items-center gap-1.5 text-xs font-bold">
                  <Clock className={`h-3.5 w-3.5 shrink-0 ${isHighlighted ? "text-primary" : "text-text-muted"}`} />
                  <span className="tabular-nums">
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

                {description && (
                  <>
                    <span className="bg-border h-3.5 w-px shrink-0" />
                    <div className="group relative flex min-w-0 flex-1 items-center">
                      <div className="text-text-secondary flex min-w-0 cursor-default items-center gap-1.5 text-xs">
                        <FileText className="text-info h-3 w-3 shrink-0" />
                        <span className="truncate">{description}</span>
                      </div>

                      <div className="border-border bg-overlay text-text-primary pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 w-max max-w-xs translate-y-1 rounded-lg border px-2.5 py-1.5 text-[11px] leading-snug wrap-break-word whitespace-normal opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {description}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getSlotStatusBadgeStyle(slot.status)}`}
              >
                {slot.status}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <aside className="border-border bg-card shadow-overlay/60 hidden flex-col rounded-2xl border shadow-2xl xl:sticky xl:top-6 xl:col-span-4 xl:flex">
        <div className="border-border bg-surface flex items-center justify-between rounded-t-2xl border-b px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="bg-primary h-2 w-2 rounded-full" />
            <span className="text-text-primary text-[11px] font-bold tracking-wider uppercase">Schedule Details</span>
          </div>

          <div className="flex items-center gap-2">
            <LocalDate
              date={selectedDate}
              variant="short"
              className="border-border bg-background text-text-secondary rounded-md border px-2.5 py-1 text-[11px] font-medium"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close schedule details"
              className="text-text-muted hover:text-text-primary cursor-pointer rounded-lg p-1 transition-colors hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-center gap-3.5">
            <img
              src={getAvatarUrl(trainer.name, trainer.profileUrl)}
              alt={trainer.name}
              className="border-border h-12 w-12 shrink-0 rounded-xl border object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-text-primary truncate text-base font-bold">{trainer.name}</h4>
              <p className="text-primary truncate text-[11px] font-semibold tracking-wide uppercase">
                {trainer.specialization?.replace(/_/g, " ") || "-"}
              </p>
              <div className="text-text-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                <span className="text-secondary font-medium">{trainer.experience ?? 0} year of experience</span>
                <span>•</span>
                <span className="truncate">{trainer.phoneNumber || trainer.email || "-"}</span>
              </div>
            </div>
          </div>

          <div className="border-border/70 flex flex-col gap-2.5 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">
                {isToday ? "All Slots Today" : "Scheduled Slots"}
              </span>
              <span className="border-info/25 bg-info/10 text-info rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                {isInitialDateLoad ? "..." : `${slots.length} Sessions`}
              </span>
            </div>

            {renderSlotList()}
          </div>
        </div>

        {isAdmin && (
          <div className="border-border bg-surface rounded-b-2xl border-t p-4">
            <Button
              type="button"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => onOpenCreateModal(trainer.id)}
              className="w-full justify-center"
            >
              Add Slot for {trainer.name.split(" ")[0]}
            </Button>
          </div>
        )}
      </aside>
    )
  }

  return (
    <div className="border-border bg-card shadow-overlay/80 sticky bottom-4 z-30 rounded-2xl border shadow-2xl xl:hidden">
      <div className="border-border bg-surface flex items-center justify-between rounded-t-2xl border-b px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-2 w-2 rounded-full" />
          <span className="text-text-primary text-[11px] font-bold tracking-wider uppercase">Schedule Details</span>
        </div>

        <div className="flex items-center gap-2">
          <LocalDate
            date={selectedDate}
            variant="short"
            className="border-border bg-background text-text-secondary rounded-md border px-2 py-0.5 text-[11px] font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close schedule details"
            className="text-text-muted hover:text-text-primary cursor-pointer rounded-lg p-1 transition-colors hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={getAvatarUrl(trainer.name, trainer.profileUrl)}
              alt={trainer.name}
              className="border-border h-10 w-10 shrink-0 rounded-xl border object-cover"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-text-primary truncate text-sm font-bold">{trainer.name}</h4>
                <span className="bg-secondary/15 text-secondary rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                  {trainer.experience ?? 0} yrs exp
                </span>
              </div>
              <p className="text-primary mt-0.5 truncate text-[11px] font-semibold tracking-wide uppercase">
                {trainer.specialization?.replace(/_/g, " ") || "-"}
              </p>
            </div>
          </div>

          <span className="border-info/25 bg-info/10 text-info shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
            {isInitialDateLoad ? "..." : `${slots.length} Sessions`}
          </span>
        </div>

        <div className="border-border/70 border-t pt-3">{renderSlotList()}</div>
      </div>

      {isAdmin && (
        <div className="border-border bg-surface rounded-b-2xl border-t p-3">
          <Button
            type="button"
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => onOpenCreateModal(trainer.id)}
            className="w-full justify-center"
          >
            Add Slot for {trainer.name.split(" ")[0]}
          </Button>
        </div>
      )}
    </div>
  )
}
