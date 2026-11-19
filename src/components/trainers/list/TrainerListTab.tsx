import { useNavigate } from "react-router"
import { Dumbbell, Search, X, Loader2 } from "lucide-react"

import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { Card, CardContent, CardHeader } from "~/components/ui/Card"
import Table from "~/components/ui/table/Table"
import TableHead from "~/components/ui/table/TableHead"
import TableTR from "~/components/ui/table/TableTR"
import TableTH from "~/components/ui/table/TableTH"
import TableBody from "~/components/ui/table/TableBody"
import TableTD from "~/components/ui/table/TableTD"
import type { TrainerItem } from "~/types/trainer"
import type { PaginationMeta } from "~/types/common"
import TrainerTableRow from "../schedule/TrainerTableRow"

interface TrainerListTabProps {
  trainers: TrainerItem[]
  pagination?: PaginationMeta["paginate"]
  searchQuery: string
  onSearchChange: (value: string) => void
  onPageChange: (url: string) => void
  isFetching: boolean
  isError: boolean
  onRefetch: () => void
  onViewSchedule: (trainerId?: string) => void
  isAdmin?: boolean
}

export default function TrainerListTab({
  trainers,
  pagination,
  searchQuery,
  onSearchChange,
  onPageChange,
  isFetching,
  isError,
  onRefetch,
  onViewSchedule,
  isAdmin = true
}: TrainerListTabProps) {
  const navigate = useNavigate()
  const hasSearch = searchQuery.trim().length > 0

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full flex-1">
          <Input
            type="text"
            placeholder="Cari nama trainer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
            {hasSearch ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Hapus pencarian"
                className="text-text-muted cursor-pointer rounded-md p-0.5 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <Search className="text-text-muted pointer-events-none h-4 w-4" />
            )}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="border-b border-white/5 p-5 pb-4 sm:p-5 sm:pb-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary h-2.5 w-2.5 rounded-full" />
                <h3 className="text-[15px] font-bold text-white">Daftar Trainer Sesi PT</h3>
              </div>
              {isFetching && (
                <span className="text-text-muted inline-flex items-center gap-1.5 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Memperbarui...
                </span>
              )}
            </div>

            <div className="text-text-muted flex flex-wrap items-center gap-4 text-[12px]">
              <span>
                Total Trainer: <strong className="text-white">{pagination?.totalData ?? trainers.length}</strong>
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-5">
          {isError ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-red-400">Gagal memuat data trainer.</p>
              <Button
                variant="secondary"
                onClick={onRefetch}
              >
                Coba Lagi
              </Button>
            </div>
          ) : (
            <div className={`transition-opacity duration-200 ${isFetching ? "pointer-events-none opacity-60" : "opacity-100"}`}>
              <Table
                meta={pagination}
                onPageChange={onPageChange}
              >
                <TableHead>
                  <TableTR isHeader={true}>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">INFO TRAINER</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">KONTAK</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">
                        SPESIALISASI &amp; PENGALAMAN
                      </div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">TARIF PER SESI</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-right text-[11px] font-bold tracking-wider uppercase">AKSI</div>
                    </TableTH>
                  </TableTR>
                </TableHead>

                <TableBody>
                  {!trainers.length ? (
                    <TableTR>
                      <TableTD colSpan={5}>
                        <div className="text-text-muted flex min-h-72 w-full flex-col items-center justify-center gap-3 text-center text-sm">
                          <Dumbbell className="h-8 w-8 opacity-30" />
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-white/80">
                              {hasSearch ? `Tidak ada trainer dengan kata kunci "${searchQuery}"` : "Belum ada trainer terdaftar"}
                            </span>
                            <span className="text-xs">
                              {hasSearch ? "Coba gunakan kata kunci lain." : "Tambahkan trainer baru untuk mulai mengelola sesi PT."}
                            </span>
                          </div>
                          {hasSearch && (
                            <Button
                              variant="secondary"
                              onClick={() => onSearchChange("")}
                            >
                              Reset Pencarian
                            </Button>
                          )}
                        </div>
                      </TableTD>
                    </TableTR>
                  ) : (
                    trainers.map((trainer, index) => (
                      <TrainerTableRow
                        key={trainer.id}
                        trainer={trainer}
                        isEven={index % 2 === 0}
                        isAdmin={isAdmin}
                        onViewSchedule={onViewSchedule}
                        onEdit={(id) => navigate(`/dashboard/trainers/${id}/edit`)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
