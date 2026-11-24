import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, CalendarCheck, CheckCircle2, Info, ChevronDown, UserCheck, Clock } from "lucide-react"

import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { Button } from "~/components/ui/Button"
import { getCurrentHourWIB, getTodayWIB } from "~/utils/date"
import type { CreateTrainerSlotRequest, TrainerItem } from "~/types/trainer"
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

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h} jam ${m} menit`
  if (h > 0) return `${h} jam`
  return `${m} menit`
}

const getDefaultHours = (slotDate: string) => {
  if (slotDate !== getTodayWIB()) {
    return { startHour: "08:00", endHour: "09:00" }
  }

  const nextHour = Math.min(getCurrentHourWIB() + 1, 22)
  const endHour = Math.min(nextHour + 1, 23)

  return {
    startHour: `${String(nextHour).padStart(2, "0")}:00`,
    endHour: `${String(endHour).padStart(2, "0")}:00`
  }
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
    if (isOpen) {
      const today = getTodayWIB()
      const validDate = defaultDate && defaultDate >= today ? defaultDate : today
      const { startHour, endHour } = getDefaultHours(validDate)

      reset({
        trainerId: defaultTrainerId || trainers[0]?.id || "",
        slotDate: validDate,
        startHour,
        endHour,
        description: ""
      })
    }
  }, [isOpen, defaultTrainerId, defaultDate, trainers, reset])

  const startHour = watch("startHour")
  const endHour = watch("endHour")

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
      startTime: data.startHour,
      endTime: data.endHour,
      description: data.description ?? ""
    })
  }

  return (
    <div
      className="fixed inset-0 top-16 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm lg:left-64"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16181D] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-bold text-white">Tambah Slot Jadwal Pelatih</h3>
              <span className="bg-primary/15 text-primary rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                Slot Pelatih
              </span>
            </div>
            <p className="text-text-muted mt-1 text-xs leading-relaxed">
              Buka ketersediaan sesi baru untuk Personal Pelatih di sistem reservasi anggota.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Tutup modal"
            className="text-text-muted cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleValidSubmit)}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex flex-col gap-5 p-6">
            <Select
              label="Pilih Pelatih / Instruktur"
              icon={UserCheck}
              rightElement={<ChevronDown className="text-text-muted pointer-events-none h-4 w-4" />}
              error={errors.trainerId?.message}
              {...register("trainerId")}
            >
              <option
                value=""
                className="bg-[#16181D]"
              >
                -- Pilih Pelatih --
              </option>
              {trainers.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  className="bg-[#16181D]"
                >
                  {t.name} — {t.specialization.replace(/_/g, " ")}
                </option>
              ))}
            </Select>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <Input
                  label="Tanggal Slot"
                  type="date"
                  min={todayWIB}
                  error={errors.slotDate?.message}
                  {...register("slotDate")}
                  className="scheme-dark"
                />
                <Input
                  label="Jam Mulai"
                  type="time"
                  error={errors.startHour?.message}
                  {...register("startHour")}
                  className="scheme-dark"
                />
                <Input
                  label="Jam Selesai"
                  type="time"
                  error={errors.endHour?.message}
                  {...register("endHour")}
                  className="scheme-dark"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0B0C10]/60 px-3.5 py-2 text-xs">
                <span className="text-text-muted inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Estimasi Durasi Sesi
                </span>
                {durationMinutes > 0 ? (
                  <span className="font-semibold text-sky-400">{formatDuration(durationMinutes)}</span>
                ) : (
                  <span className="font-semibold text-red-400">Rentang jam tidak valid</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-text-muted block text-[11px] font-bold tracking-wider uppercase">Catatan / Deskripsi Sesi</label>
                <span className="text-text-muted text-[11px]">Opsional</span>
              </div>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Contoh: Sesi spesialisasi squat form correction & hip mobility. Siapkan lifting belt member..."
                className={`placeholder:text-text-muted focus:border-primary focus:ring-primary block w-full resize-none rounded-xl border bg-[#0B0C10] p-3.5 text-[14px] text-white transition-all focus:ring-1 focus:outline-none ${
                  errors.description ? "border-danger focus:border-danger focus:ring-danger" : "border-white/4"
                }`}
              />
              {errors.description && <p className="text-danger mt-1 text-xs font-medium">{errors.description.message}</p>}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-3.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-amber-200">Validasi Jadwal Otomatis</p>
                <p className="text-text-muted mt-0.5">
                  Sistem akan mengecek bentrok jadwal pelatih pada{" "}
                  <strong className="text-white">
                    {startHour || "--:--"} – {endHour || "--:--"} WIB
                  </strong>{" "}
                  untuk sesi privat <strong className="text-white">( 1 member )</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-white/5 bg-[#121419] px-6 py-4 sm:flex-row">
            <span className="text-text-muted inline-flex items-center gap-1.5 text-[11px]">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Langsung disinkronkan ke aplikasi member.
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
                {isSubmitting ? "Menyimpan..." : "Simpan Slot"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
