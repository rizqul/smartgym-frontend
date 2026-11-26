import { useEffect, useMemo, useState } from "react"
import { Clock, FileText, Loader2, Pencil, Plus, RotateCcw, X } from "lucide-react"

import { Button } from "~/components/ui/Button"
import LocalDate from "~/components/ui/LocalDate"
import { useGetTrainerBookingsQuery, useGetTrainerSlotsQuery } from "~/services/trainer.service"
import { getAvatarUrl } from "~/utils/avatar"
import type { TrainerBookingMember, TrainerItem, TrainerSlotItem } from "~/types/trainer.type"
import { formatDateValue, getSlotStatusBadgeStyle } from "../../../utils/scheduleHelpers"
import EditTrainerSlotModal from "./EditTrainerSlotModal"

interface TrainerSlotDetailPanelProps {
  trainer: TrainerItem
  selectedSlot?: TrainerSlotItem | null
  selectedDate: string
  isAdmin: boolean
  variant: "sidebar" | "bottom"
  onClose: () => void
  onOpenCreateModal: (trainerId: string) => void
}

const getStatusDotColor = (status?: string) => {
  const upper = status?.toUpperCase()
  if (upper === "AVAILABLE") return "bg-emerald-400"
  if (upper === "BOOKED") return "bg-amber-400"
  return "bg-white/40"
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

  const { data: bookingData } = useGetTrainerBookingsQuery(
    {
      trainerId: trainer.id,
      date: selectedDate,
      size: 100
    },
    { skip: !isAdmin }
  )

  const slots = currentData?.data ?? []
  const isInitialDateLoad = isFetching && !currentData
  const isToday = selectedDate === formatDateValue(new Date())

  const [activeSlotId, setActiveSlotId] = useState<string | null>(selectedSlot?.id ?? null)
  const [editingSlot, setEditingSlot] = useState<TrainerSlotItem | null>(null)

  useEffect(() => {
    if (selectedSlot?.id) {
      setActiveSlotId(selectedSlot.id)
    } else if (slots.length > 0) {
      setActiveSlotId((prev) => (slots.some((s) => s.id === prev) ? prev : slots[0].id))
    } else {
      setActiveSlotId(null)
    }
  }, [selectedSlot?.id, slots])

  const bookedMemberBySlotId = useMemo(() => {
    const map = new Map<string, TrainerBookingMember>()
    for (const booking of bookingData?.data ?? []) {
      if (booking.slot?.id && booking.member) {
        map.set(booking.slot.id, booking.member)
      }
    }
    return map
  }, [bookingData?.data])

  const activeSlot = useMemo(() => slots.find((s) => s.id === activeSlotId) ?? slots[0] ?? null, [slots, activeSlotId])

  const renderSlotSection = () => {
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

    const activeBookedMember = activeSlot ? bookedMemberBySlotId.get(activeSlot.id) : undefined
    const isBooked = activeSlot?.status?.toUpperCase() === "BOOKED"
    const canEdit = isAdmin && activeSlot && !isBooked

    return (
      <div className={`flex flex-col gap-3 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 xl:grid-cols-3">
          {slots.map((slot) => {
            const isSelected = activeSlot?.id === slot.id
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setActiveSlotId(slot.id)}
                className={`flex cursor-pointer items-center justify-between gap-0.5 rounded-lg border px-2 py-1.5 text-left text-[10px] font-semibold transition-all ${
                  isSelected
                    ? "border-primary bg-primary/15 text-white shadow-sm"
                    : "border-border/60 bg-surface text-text-secondary hover:border-border hover:text-white"
                }`}
              >
                <span className="flex items-center gap-0.5 truncate tabular-nums">
                  <LocalDate
                    date={slot.startTime}
                    variant="hour"
                  />
                  <span className="text-text-muted">-</span>
                  <LocalDate
                    date={slot.endTime}
                    variant="hour"
                  />
                </span>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${getStatusDotColor(slot.status)}`} />
              </button>
            )
          })}
        </div>

        {activeSlot && (
          <div className="border-primary/40 bg-background/70 flex items-start justify-between gap-3 rounded-xl border p-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="text-text-primary flex items-center gap-1.5 text-xs font-bold tabular-nums">
                <Clock className="text-primary h-3.5 w-3.5 shrink-0" />
                <LocalDate
                  date={activeSlot.startTime}
                  variant="hour"
                />
                <span className="text-text-muted">-</span>
                <LocalDate
                  date={activeSlot.endTime}
                  variant="hour"
                />
              </div>

              <div className="group relative flex min-w-0 items-center">
                <div className="text-text-secondary flex min-w-0 cursor-default items-center gap-1.5 text-xs">
                  <FileText className="text-info h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{activeSlot.description?.trim() || "No description"}</span>
                </div>

                {activeSlot.description?.trim() && (
                  <div className="border-border bg-overlay text-text-primary pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 w-max max-w-xs translate-y-1 rounded-lg border px-2.5 py-1.5 text-[11px] leading-snug wrap-break-word whitespace-normal opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {activeSlot.description.trim()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getSlotStatusBadgeStyle(activeSlot.status)}`}
              >
                {activeSlot.status}
              </span>

              {activeBookedMember && (
                <div
                  title={activeBookedMember.phoneNumber || activeBookedMember.email}
                  className="border-border/60 bg-surface inline-flex max-w-36 items-center gap-1.5 rounded-full border py-0.5 pr-2 pl-1"
                >
                  <img
                    src={getAvatarUrl(activeBookedMember.name, activeBookedMember.profileUrl)}
                    alt={activeBookedMember.name}
                    className="h-4 w-4 shrink-0 rounded-full object-cover"
                  />
                  <span className="text-text-primary truncate text-[10.5px] font-semibold">{activeBookedMember.name}</span>
                </div>
              )}

              {canEdit && (
                <button
                  type="button"
                  onClick={() => setEditingSlot(activeSlot)}
                  className="border-border bg-surface hover:border-primary/50 hover:text-primary text-text-secondary inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-0.5 text-[10.5px] font-semibold transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {variant === "sidebar" ? (
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

              {renderSlotSection()}
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
      ) : (
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

            <div className="border-border/70 border-t pt-3">{renderSlotSection()}</div>
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
      )}

      <EditTrainerSlotModal
        isOpen={Boolean(editingSlot)}
        trainerId={trainer.id}
        trainerName={trainer.name}
        slot={editingSlot}
        defaultDate={selectedDate}
        onClose={() => setEditingSlot(null)}
      />
    </>
  )
}
