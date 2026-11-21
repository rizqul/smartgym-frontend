import { Award, Calendar, Pencil } from "lucide-react"

import TableTR from "~/components/ui/table/TableTR"
import TableTD from "~/components/ui/table/TableTD"
import { formatRupiah } from "~/utils/format"
import type { TrainerItem } from "~/types/trainer"
import Avatar from "~/components/ui/Avatar"

interface TrainerTableRowProps {
  trainer: TrainerItem
  isEven: boolean
  isAdmin: boolean
  onViewSchedule: (trainerId: string) => void
  onEdit: (trainerId: string) => void
}

const formatSpecialization = (spec?: string) => (spec ? spec.replace(/_/g, " ") : "-")

export default function TrainerTableRow({ trainer, isEven, isAdmin, onViewSchedule, onEdit }: TrainerTableRowProps) {
  return (
    <TableTR isEven={isEven}>
      <TableTD>
        <div className="flex items-center gap-3">
          <Avatar
            src={trainer.profileUrl}
            name={trainer.name}
            className="h-10 w-10 rounded-xl shadow-sm"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-bold text-white">{trainer.name}</span>
            <span className="text-text-muted max-w-55 truncate text-[12px]">{trainer.email}</span>
          </div>
        </div>
      </TableTD>

      <TableTD>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-white">{trainer.phoneNumber || "-"}</span>
      </TableTD>

      <TableTD>
        <div className="flex flex-col gap-1">
          <span className="bg-primary/10 text-primary inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase">
            {formatSpecialization(trainer.specialization)}
          </span>
          <span className="text-text-muted inline-flex items-center gap-1 text-[12px]">
            <Award className="h-3.5 w-3.5 shrink-0" />
            {trainer.experience ?? 0} Tahun Pengalaman
          </span>
        </div>
      </TableTD>

      <TableTD>
        <span className="text-[13px] font-bold whitespace-nowrap text-white">{formatRupiah(trainer.rate ?? 0)}</span>
      </TableTD>

      <TableTD>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onViewSchedule(trainer.id)}
            title="Lihat Jadwal"
            aria-label={`Lihat jadwal ${trainer.name}`}
            className="cursor-pointer rounded-lg border border-sky-500/20 bg-sky-500/10 p-2 text-sky-400 transition-colors hover:bg-sky-500/20"
          >
            <Calendar className="h-4 w-4" />
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => onEdit(trainer.id)}
              title="Edit Trainer"
              aria-label={`Edit ${trainer.name}`}
              className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      </TableTD>
    </TableTR>
  )
}
