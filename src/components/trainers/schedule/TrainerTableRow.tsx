import { Briefcase, Loader2, Pencil, Trash2 } from "lucide-react"

import { TableTR, TableTD } from "~/components/ui/table"
import Avatar from "~/components/ui/Avatar"
import LocalDate from "~/components/ui/LocalDate"
import { formatRupiah } from "~/utils/format"
import type { TrainerItem } from "~/types/trainer.type"

interface TrainerTableRowProps {
  trainer: TrainerItem
  isEven: boolean
  isAdmin: boolean
  onEdit?: (trainer: TrainerItem) => void
  onDelete?: (trainer: TrainerItem) => void
  isDeleting?: boolean
}

const formatSpecialization = (spec?: string) => (spec ? spec.replace(/_/g, " ") : "-")

export default function TrainerTableRow({ trainer, isEven, isAdmin, onEdit, onDelete, isDeleting = false }: TrainerTableRowProps) {
  return (
    <TableTR isEven={isEven}>
      <TableTD>
        <div className="flex items-center gap-3">
          <Avatar
            src={trainer.profileUrl}
            name={trainer.name}
            className="h-10 w-10 shrink-0 rounded-xl border border-white/10 shadow-sm"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[14px] font-bold text-white">{trainer.name}</span>
            <span className="text-text-muted text-[11px]">
              {trainer.createdAt ? (
                <>
                  Joined{" "}
                  <LocalDate
                    date={trainer.createdAt}
                    variant="default"
                  />
                </>
              ) : (
                `#${trainer.id.slice(0, 8)}`
              )}
            </span>
          </div>
        </div>
      </TableTD>

      <TableTD>
        <div className="flex flex-col">
          {trainer.email && <span className="text-[13px] text-white">{trainer.email}</span>}
          <span className="text-[12px] font-medium tracking-wide whitespace-nowrap text-[#A28F79]">{trainer.phoneNumber || "-"}</span>
        </div>
      </TableTD>

      <TableTD>
        <div className="flex flex-col gap-1.5">
          <span className="bg-primary/10 text-primary border-primary/20 inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap uppercase">
            {formatSpecialization(trainer.specialization)}
          </span>
          <span className="text-text-muted inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>
              <strong className="font-semibold text-white/90">{trainer.experience ?? 0} Years</strong> of Experience
            </span>
          </span>
        </div>
      </TableTD>

      {isAdmin && (
        <>
          <TableTD>
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-[13px] font-bold text-white">{formatRupiah(trainer.rate ?? 0)}</span>
              <span className="text-text-muted text-[11px]">/ session</span>
            </div>
          </TableTD>
          <TableTD>
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => onEdit?.(trainer)}
                disabled={isDeleting}
                title="Edit Trainer"
                aria-label={`Edit ${trainer.name}`}
                className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onDelete?.(trainer)}
                disabled={isDeleting}
                title="Delete Trainer"
                aria-label={`Delete ${trainer.name}`}
                className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          </TableTD>
        </>
      )}
    </TableTR>
  )
}
