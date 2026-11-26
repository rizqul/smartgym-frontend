import { Dumbbell, Search, X, Loader2 } from "lucide-react"

import { Input } from "~/components/ui/Input"
import { Button } from "~/components/ui/Button"
import { Card, CardContent, CardHeader } from "~/components/ui/Card"
import { Table, TableHead, TableBody, TableTR, TableTH, TableTD } from "~/components/ui/table"
import type { TrainerItem } from "~/types/trainer.type"
import type { PaginationMeta } from "~/types/common.type"
import TrainerTableRow from "../schedule/TrainerTableRow"

interface TrainerListTabProps {
  trainers: TrainerItem[]
  pagination?: PaginationMeta["paginate"]
  searchQuery: string
  onSearchChange: (value: string) => void
  onPageChange: (url: string) => void
  onPageSizeChange: (size: number) => void
  isFetching: boolean
  isError: boolean
  onRefetch: () => void
  onEdit?: (trainer: TrainerItem) => void
  onDelete?: (trainer: TrainerItem) => void
  deletingId?: string | null
  isAdmin?: boolean
}

export default function TrainerListTab({
  trainers,
  pagination,
  searchQuery,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  isFetching,
  isError,
  onRefetch,
  onEdit,
  onDelete,
  deletingId = null,
  isAdmin = true
}: TrainerListTabProps) {
  const hasSearch = searchQuery.trim().length > 0
  const totalColumns = isAdmin ? 6 : 4

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-5 pb-4 sm:p-5 sm:pb-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-md">
            <Input
              type="text"
              icon={Search}
              placeholder="Search by trainer name or specialization..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="py-2 text-[13px]"
              rightElement={
                hasSearch ? (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    aria-label="Clear search"
                    className="text-text-muted cursor-pointer rounded-md p-0.5 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : undefined
              }
            />
          </div>

          {isFetching && (
            <span className="text-text-muted inline-flex shrink-0 items-center gap-1.5 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating...
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 sm:p-5 sm:pt-0">
        {isError ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-red-400">Failed to load trainer data.</p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={onRefetch}
              >
                Try Again
              </Button>
              {hasSearch && (
                <Button
                  variant="secondary"
                  onClick={() => onSearchChange("")}
                >
                  Reset Search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={`transition-opacity duration-200 ${isFetching ? "pointer-events-none opacity-60" : "opacity-100"}`}>
            <Table
              meta={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              entityName="trainers"
            >
              <TableHead>
                <TableTR isHeader={true}>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">TRAINER DETAILS</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">CONTACT</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">
                      SPECIALIZATION &amp; EXPERIENCE
                    </div>
                  </TableTH>
                  {isAdmin && (
                    <>
                      <TableTH>
                        <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">RATE / SESSION</div>
                      </TableTH>
                      <TableTH>
                        <div className="text-text-muted text-right text-[11px] font-bold tracking-wider uppercase">ACTIONS</div>
                      </TableTH>
                    </>
                  )}
                </TableTR>
              </TableHead>

              <TableBody>
                {!trainers.length ? (
                  <TableTR hideRowNumber>
                    <TableTD colSpan={totalColumns}>
                      <div className="text-text-muted flex min-h-72 w-full flex-col items-center justify-center gap-3 text-center text-sm">
                        <Dumbbell className="h-8 w-8 opacity-30" />
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-white/80">
                            {hasSearch ? `No trainers found for "${searchQuery}"` : "No trainers registered yet"}
                          </span>
                          <span className="text-xs">
                            {hasSearch ? "Try using a different keyword." : "Add a new trainer to start managing PT sessions."}
                          </span>
                        </div>
                        {hasSearch && (
                          <Button
                            variant="secondary"
                            onClick={() => onSearchChange("")}
                          >
                            Reset Search
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
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDeleting={deletingId === trainer.id}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}