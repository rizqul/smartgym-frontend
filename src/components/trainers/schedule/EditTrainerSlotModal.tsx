import { useEffect, useState } from "react"
import { Calendar, Clock, FileText, Loader2, Pencil, X } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { useUpdateTrainerSlotMutation } from "~/services/trainer.service"
import type { TrainerSlotItem } from "~/types/trainer.type"

interface EditTrainerSlotModalProps {
  isOpen: boolean
  trainerId: string
  trainerName: string
  slot: TrainerSlotItem | null
  defaultDate: string
  onClose: () => void
}

const toTimeInputValue = (isoDate?: string | null) => {
  if (!isoDate) return ""
  const d = new Date(isoDate)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

export default function EditTrainerSlotModal({ isOpen, trainerId, trainerName, slot, defaultDate, onClose }: EditTrainerSlotModalProps) {
  const [slotDate, setSlotDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")

  const [updateTrainerSlot, { isLoading }] = useUpdateTrainerSlotMutation()

  useEffect(() => {
    if (!isOpen || !slot) return
    setSlotDate(defaultDate)
    setStartTime(toTimeInputValue(slot.startTime))
    setEndTime(toTimeInputValue(slot.endTime))
    setDescription(slot.description ?? "")
  }, [isOpen, slot, defaultDate])

  if (!isOpen || !slot) return null

  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!slotDate || !startTime || !endTime) {
      toast.error("Please fill in date, start time, and end time.")
      return
    }

    if (startTime >= endTime) {
      toast.error("Start time must be earlier than end time.")
      return
    }

    try {
      await updateTrainerSlot({
        slotId: slot.id,
        trainerId,
        slotDate,
        startTime,
        endTime,
        description: description.trim()
      }).unwrap()

      toast.success("Schedule slot updated successfully!")
      onClose()
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message || "Failed to update schedule slot."
      toast.error(message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="border-border bg-card w-full max-w-md rounded-2xl border shadow-2xl">
        <div className="border-border bg-surface flex items-center justify-between rounded-t-2xl border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Pencil className="text-primary h-4 w-4" />
            <div>
              <h3 className="text-text-primary text-sm font-bold">Edit Schedule Slot</h3>
              <p className="text-text-muted text-[11px]">{trainerName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-text-muted hover:text-text-primary cursor-pointer rounded-lg p-1 hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-5"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted flex items-center gap-1.5 text-xs font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Slot Date
            </label>
            <Input
              type="date"
              min={today}
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2 text-sm text-white scheme-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-muted flex items-center gap-1.5 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                Start Time
              </label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2 text-sm text-white scheme-dark"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-text-muted flex items-center gap-1.5 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                End Time
              </label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2 text-sm text-white scheme-dark"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted flex items-center gap-1.5 text-xs font-medium">
              <FileText className="h-3.5 w-3.5" />
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Upper body strength session"
              className="focus:border-primary focus:ring-primary w-full resize-none rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:ring-1 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              leftIcon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
