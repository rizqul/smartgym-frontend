import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, CalendarCheck, CheckCircle2, Info } from "lucide-react"

import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { Button } from "~/components/ui/Button"
import type { TrainerItem } from "~/types/trainer"

import { CreateTrainerSlotValidation, type CreateTrainerSlotData } from "~/validation/trainer"

export interface CreateSlotFormPayload {
  trainerId: string
  slotDate: string 
  startTime: string 
  endTime: string 
  quota: string
  description: string
}

interface CreateTrainerSlotModalProps {
  isOpen: boolean
  onClose: () => void
  trainers: TrainerItem[]
  defaultTrainerId?: string
  defaultDate: string
  isSubmitting?: boolean
  onSubmit: (payload: CreateSlotFormPayload) => void
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CreateTrainerSlotData>({
    resolver: zodResolver(CreateTrainerSlotValidation),
    defaultValues: {
      trainerId: defaultTrainerId || trainers[0]?.id || "",
      slotDate: defaultDate,
      startHour: "16:00",
      endHour: "17:00",
      quota: "1",
      description: ""
    }
  })

  const startHour = watch("startHour")
  const endHour = watch("endHour")
  const quota = watch("quota")

  const durationMinutes = useMemo(() => {
    if (!startHour || !endHour) return 0
    const [sh, sm] = startHour.split(":").map(Number)
    const [eh, em] = endHour.split(":").map(Number)
    return eh * 60 + em - (sh * 60 + sm)
  }, [startHour, endHour])

  if (!isOpen) return null

  const handleValidSubmit = (data: CreateTrainerSlotData) => {
    onSubmit({
      trainerId: data.trainerId,
      slotDate: data.slotDate,
      startTime: `${data.slotDate}T${data.startHour}`,
      endTime: `${data.slotDate}T${data.endHour}`,
      quota: data.quota,
      description: data.description
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#16181D] shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/5 px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-white">Tambah Slot Jadwal Trainer</h3>
              <span className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                TRAINER_SLOTS
              </span>
            </div>
            <p className="text-text-muted mt-1 text-xs">Buka ketersediaan sesi baru untuk Personal Trainer di sistem reservasi member.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-col gap-5 p-6"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white">
              Pilih Trainer / Instruktur <span className="text-primary">*</span>
            </label>
            <Select
              error={errors.trainerId?.message}
              {...register("trainerId")}
              className="focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
            >
              <option value="">-- Pilih Trainer --</option>
              {trainers.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                >
                  {t.name} — {t.specialization.replace(/_/g, " ")}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Tanggal Slot *"
              type="date"
              error={errors.slotDate?.message}
              {...register("slotDate")}
              className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2.5 text-[13px] text-white"
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">
                  Rentang Jam Sesi <span className="text-primary">*</span>
                </label>
                {durationMinutes > 0 && <span className="text-[11px] font-semibold text-sky-400">Durasi: {durationMinutes} Menit</span>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  error={errors.startHour?.message}
                  {...register("startHour")}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3 py-2.5 text-[13px] text-white"
                />
                <Input
                  type="time"
                  error={errors.endHour?.message}
                  {...register("endHour")}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3 py-2.5 text-[13px] text-white"
                />
              </div>
            </div>
          </div>

          <Input
            label="Kuota Member *"
            type="text"
            inputMode="numeric"
            placeholder="Contoh: 5"
            error={errors.quota?.message}
            {...register("quota")}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "")
            }}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white">
              Catatan / Deskripsi Sesi <span className="text-primary">*</span>
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Contoh: Sesi spesialisasi squat form correction & hip mobility. Siapkan lifting belt member..."
              className={`placeholder:text-text-muted focus:border-primary focus:ring-primary w-full resize-none rounded-xl border bg-[#0B0C10] p-3.5 text-[13px] text-white transition-all focus:ring-1 focus:outline-none ${
                errors.description ? "border-red-500/60" : "border-white/10"
              }`}
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/3 p-3.5">
            <div className="bg-primary/15 text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-amber-200">Validasi Jadwal Otomatis</p>
              <p className="text-text-muted mt-0.5">
                Sistem akan mengecek bentrok jadwal untuk trainer terpilih pada rentang{" "}
                <strong className="text-white">
                  {startHour || "--:--"} - {endHour || "--:--"} WIB
                </strong>{" "}
                dengan kapasitas <strong className="text-white">{quota || 0} member</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-white/5 pt-4 sm:flex-row">
            <span className="text-text-muted inline-flex items-center gap-1.5 text-[11px]">
              <Info className="h-3.5 w-3.5" />
              Data slot langsung disinkronkan ke aplikasi member.
            </span>

            <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan & Buka Slot"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
