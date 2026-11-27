import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, CalendarCheck, CheckCircle2, Info, ChevronDown, UserCheck, Clock } from "lucide-react"

import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { Button } from "~/components/ui/Button"
import { Alert } from "~/utils/alert"
import { formatDateWIB, getCurrentHourWIB, getTodayWIB } from "~/utils/date"
import {
  GYM_CLOSE_HOUR,
  GYM_CLOSE_TIME,
  GYM_OPEN_TIME,
  escapeHtml,
  formatDuration,
  getDefaultHours,
  getDurationMinutes,
  getMinStartTime,
  isWithinOperatingHours
} from "~/utils/slotTime"
import type { CreateTrainerSlotRequest, TrainerItem } from "~/types/trainer.type"
import { CreateTrainerSlotValidation, type CreateTrainerSlotData } from "~/validation/trainer"

interface CreateTrainerSlotModalProps {
  isOpen: boolean
  onClose: () => void
  trainers: TrainerItem[]
  defaultTrainerId?: string
  defaultDate: string
  isSubmitting?: boolean
  onSubmit: (payload: CreateTrainerSlotRequest) => void
}

export default function CreateTrainerSlotModal({
  isOpen,
  onClose,
  trainers,
  defaultTrainerId,
  defaultDate,
  isSubmitting = false,
  onSubmit
}: CreateTrainerSlotModalProps) {
  const trainersRef = useRef(trainers)
  trainersRef.current = trainers

  const prevOpenRef = useRef(false)
  const isConfirmingRef = useRef(false)

  const todayWIB = getTodayWIB()
  const initialDate = defaultDate && defaultDate >= todayWIB ? defaultDate : todayWIB
  const initialHours = getDefaultHours(initialDate)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateTrainerSlotData>({
    resolver: zodResolver(CreateTrainerSlotValidation),
    defaultValues: {
      trainerId: defaultTrainerId || trainers[0]?.id || "",
      slotDate: initialDate,
      startHour: initialHours.startHour,
      endHour: initialHours.endHour,
      description: ""
    }
  })

  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current
    prevOpenRef.current = isOpen

    if (justOpened) {
      const today = getTodayWIB()
      const validDate = defaultDate && defaultDate >= today ? defaultDate : today
      const { startHour, endHour } = getDefaultHours(validDate)
      const list = trainersRef.current

      reset({
        trainerId: defaultTrainerId || list[0]?.id || "",
        slotDate: validDate,
        startHour,
        endHour,
        description: ""
      })
    }
  }, [isOpen, defaultTrainerId, defaultDate, reset])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting && !isConfirmingRef.current) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  const slotDate = watch("slotDate")
  const startHour = watch("startHour")
  const endHour = watch("endHour")

  const durationMinutes = useMemo(() => getDurationMinutes(startHour, endHour), [startHour, endHour])

  if (!isOpen) return null

  const isTodaySlot = slotDate === todayWIB
  const isTodayClosed = isTodaySlot && getCurrentHourWIB() >= GYM_CLOSE_HOUR
  const minStartTime = getMinStartTime(slotDate)
  const isTimeInputDisabled = isSubmitting || isTodayClosed
  const validHours = isWithinOperatingHours(startHour, endHour)
  const isFormBlocked = isSubmitting || trainers.length === 0 || isTodayClosed || !validHours || durationMinutes <= 0

  const handleValidSubmit = async (data: CreateTrainerSlotData) => {
    if (!isWithinOperatingHours(data.startHour, data.endHour) || isTodayClosed) return

    const selectedTrainer = trainers.find((t) => t.id === data.trainerId)
    const trimmedDescription = data.description?.trim() ?? ""

    const trainerName = escapeHtml(selectedTrainer?.name ?? "-")
    const specialization = escapeHtml(selectedTrainer?.specialization?.replace(/_/g, " ") || "-")
    const formattedDate = escapeHtml(formatDateWIB(data.slotDate))
    const timeRange = `${escapeHtml(data.startHour)} – ${escapeHtml(data.endHour)} WIB`
    const durationText = durationMinutes > 0 ? escapeHtml(formatDuration(durationMinutes)) : "-"
    const noteRow = trimmedDescription
      ? `<div class="mt-2 flex items-start justify-between gap-3 border-t border-white/10 pt-2">
           <span class="shrink-0 text-text-muted">Notes</span>
           <span class="text-right wrap-break-word text-text-secondary">${escapeHtml(trimmedDescription)}</span>
         </div>`
      : ""

    isConfirmingRef.current = true
    try {
      const result = await Alert.confirm({
        icon: "question",
        title: "Confirm Schedule Slot",
        confirmText: "Yes, Save Slot",
        cancelText: "Check Again",
        html: `
          <p class="mb-3.5 text-[13px] text-text-secondary">
            Please make sure the trainer slot details below are correct before saving.
          </p>
          <div class="rounded-xl border border-border/60 bg-background p-3.5 text-left text-xs leading-relaxed">
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="text-text-muted">Trainer</span>
              <span class="text-right font-semibold text-white">${trainerName}</span>
            </div>
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="text-text-muted">Specialization</span>
              <span class="text-right font-semibold text-primary">${specialization}</span>
            </div>
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="text-text-muted">Date</span>
              <span class="text-right font-medium text-white">${formattedDate}</span>
            </div>
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="text-text-muted">Time</span>
              <span class="text-right font-semibold text-white">${timeRange}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-text-muted">Duration</span>
              <span class="text-right font-semibold text-info">${durationText}</span>
            </div>
            ${noteRow}
          </div>
        `
      })

      if (!result.isConfirmed) return

      onSubmit({
        trainerId: data.trainerId,
        slotDate: data.slotDate,
        startTime: data.startHour,
        endTime: data.endHour,
        description: trimmedDescription
      })
    } finally {
      isConfirmingRef.current = false
    }
  }

  return (
    <div
      className="fixed inset-0 top-16 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm lg:left-64"
      onClick={() => !isSubmitting && !isConfirmingRef.current && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-slot-modal-title"
        className="border-border/70 bg-surface flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border/60 flex items-start justify-between gap-4 border-b px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3
                id="create-slot-modal-title"
                className="text-lg font-bold text-white"
              >
                Add Trainer Schedule Slot
              </h3>
              <span className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                Trainer Slot
              </span>
            </div>
            <p className="text-text-muted mt-1 text-xs leading-relaxed">
              Open a new session availability for member personal training reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-6">
            <Select
              label="Select Trainer / Instructor"
              icon={UserCheck}
              rightElement={<ChevronDown className="text-text-muted pointer-events-none h-4 w-4" />}
              error={errors.trainerId?.message}
              {...register("trainerId")}
            >
              <option
                value=""
                className="bg-surface"
              >
                {trainers.length ? "-- Select Trainer --" : "No trainers available"}
              </option>
              {trainers.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  className="bg-surface"
                >
                  {t.name} — {t.specialization?.replace(/_/g, " ") || "-"}
                </option>
              ))}
            </Select>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5">
                <div className="col-span-2 sm:col-span-1">
                  <Input
                    label="Slot Date"
                    type="date"
                    min={todayWIB}
                    disabled={isSubmitting}
                    error={errors.slotDate?.message}
                    {...register("slotDate")}
                    className="scheme-dark"
                  />
                </div>
                <div className="min-w-0">
                  <Input
                    label="Start Time"
                    type="time"
                    min={minStartTime}
                    max={GYM_CLOSE_TIME}
                    disabled={isTimeInputDisabled}
                    {...register("startHour")}
                    className="scheme-dark"
                  />
                </div>
                <div className="min-w-0">
                  <Input
                    label="End Time"
                    type="time"
                    min={startHour || minStartTime}
                    max={GYM_CLOSE_TIME}
                    disabled={isTimeInputDisabled}
                    {...register("endHour")}
                    className="scheme-dark"
                  />
                </div>
              </div>

              <div className="border-border/50 bg-background/70 flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2 text-xs">
                <span className="text-text-muted inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Estimated Session Duration
                </span>
                {isTodayClosed ? (
                  <span className="text-warning text-right font-semibold">
                    Operational hours {GYM_OPEN_TIME} – {GYM_CLOSE_TIME} (closed today)
                  </span>
                ) : !validHours ? (
                  <span className="text-danger text-right font-semibold">
                    Operational hours: {GYM_OPEN_TIME} – {GYM_CLOSE_TIME}
                  </span>
                ) : durationMinutes > 0 ? (
                  <span className="text-info font-semibold">{formatDuration(durationMinutes)}</span>
                ) : (
                  <span className="text-text-muted font-medium">-</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="slot-description"
                  className="text-text-muted block text-[11px] font-bold tracking-wider uppercase"
                >
                  Session Notes / Description
                </label>
                <span className="text-text-muted text-[11px]">Optional</span>
              </div>
              <textarea
                id="slot-description"
                rows={3}
                disabled={isSubmitting}
                {...register("description")}
                placeholder="Further Information"
                className={`placeholder:text-text-muted focus:border-primary focus:ring-primary bg-background block w-full resize-none rounded-xl border p-3.5 text-[14px] text-white transition-all focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description ? "border-danger focus:border-danger focus:ring-danger" : "border-border/70"
                }`}
              />
            </div>

            <div className="border-warning/20 bg-warning/5 flex items-center gap-3 rounded-xl border px-3.5 py-2.5">
              <div className="bg-warning/15 text-warning flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 text-xs leading-snug">
                <p className="text-secondary font-bold">Information</p>
                <p className="text-text-muted mt-0.5">
                  Open{" "}
                  <strong className="text-text-primary">
                    {GYM_OPEN_TIME}–{GYM_CLOSE_TIME} WIB
                  </strong>{" "}
                  • Checks{" "}
                  <strong className="text-text-primary">
                    {startHour || "--:--"}–{endHour || "--:--"} WIB
                  </strong>{" "}
                  for <strong className="text-text-primary">1-member</strong> sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="border-border/60 bg-background/60 flex flex-col-reverse items-center justify-between gap-3 border-t px-6 py-4 sm:flex-row">
            <span className="text-text-muted inline-flex items-center gap-1.5 text-[11px]">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Automatically synchronized with the member app.
            </span>

            <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isFormBlocked}
                isLoading={isSubmitting}
                leftIcon={!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
              >
                {isSubmitting ? "Saving..." : "Save Slot"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
