import { Award, Briefcase, Clock, Loader2, Phone } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/Card"
import LocalDate from "~/components/ui/LocalDate"
import { getAvatarUrl } from "~/utils/avatar"
import { useGetTrainerSlotsQuery } from "~/services/trainer"
import type { TrainerItem, TrainerSlotItem } from "~/types/trainer"
import { getSlotStatusBadgeStyle } from "../../../utils/scheduleHelpers"

const MAX_VISIBLE_SLOTS = 3

interface TrainerScheduleCardProps {
  trainer: TrainerItem
  selectedDate: string
  isSelected: boolean
  selectedSlotId?: string
  isAdmin: boolean
  onSelectTrainer: (trainer: TrainerItem, firstSlot?: TrainerSlotItem) => void
  onSelectSlot: (trainer: TrainerItem, slot: TrainerSlotItem) => void
  onOpenCreateModal: (trainerId: string) => void
}

export default function TrainerScheduleCard({
  trainer,
  selectedDate,
  isSelected,
  selectedSlotId,
  onSelectTrainer,
  onSelectSlot
}: TrainerScheduleCardProps) {
  const { data: slotsRes, isLoading } = useGetTrainerSlotsQuery({
    trainerId: trainer.id,
    date: selectedDate
  })

  const slots = slotsRes?.data ?? []
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
                <p className="text-text-muted truncate text-[11px] uppercase">{trainer.specialization.replace(/_/g, " ")}</p>
              </div>
            </div>

            {isSelected && <span className="bg-primary shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold text-black">Dipilih</span>}
          </div>

          <div className="text-text-muted flex flex-wrap items-center gap-2 border-b border-white/5 pb-3 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-semibold text-amber-300">
              <Briefcase className="h-3 w-3" />
              Pengalaman {trainer.experience} Thn
            </span>
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3 text-sky-400" />
              {trainer.phoneNumber || "-"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-4 pt-0 sm:p-4 sm:pt-0">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">JADWAL SESI HARI INI</span>
            <span className="text-text-muted inline-flex items-center gap-1 text-[10px] font-medium">
              <Award className="text-primary h-3 w-3" />
              {slots.length} Sesi
            </span>
          </div>

          {isLoading ? (
            <div className="text-text-muted flex flex-1 items-center justify-center gap-2 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Memuat jadwal...
            </div>
          ) : !slots.length ? (
            <div className="text-text-muted flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0B0C10]/40 px-3 text-center text-[11px]">
              Belum ada slot di tanggal ini
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {visibleSlots.map((slot) => {
                const isSlotActive = selectedSlotId === slot.id
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSlot(trainer, slot)
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition-all ${
                      isSlotActive
                        ? "border-primary/60 bg-primary/15 text-white"
                        : "border-white/5 bg-[#0B0C10]/70 text-white/85 hover:border-white/15 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-white">
                      <Clock className="text-primary h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
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
                  </button>
                )
              })}

              {remainingSlotsCount > 0 && (
                <div className="text-text-muted flex justify-center pt-0.5 text-[11px] font-medium">
                  <span>+{remainingSlotsCount} slot lainnya</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="justify-between border-t border-white/5 p-4 pt-3 text-[11px] sm:p-4 sm:pt-3">
        <span className="font-medium text-sky-400">{slots.length > 0 ? `${slots.length} Slot Terjadwal` : "Slot Kosong"}</span>
        <span className="text-text-muted text-[10px]">Klik untuk lihat detail</span>
      </CardFooter>
    </Card>
  )
}
