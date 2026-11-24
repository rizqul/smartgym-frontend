import { useState } from "react"
import { ChevronDown, Search, Receipt, CheckCircle2, Hourglass, XCircle, Loader2, X } from "lucide-react"

import { Button } from "~/components/ui/Button"
import { Card, CardContent, CardHeader } from "~/components/ui/Card"
import { CardStats } from "~/components/ui/CardStats"
import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { Table, TableHead, TableBody, TableTR, TableTH, TableTD } from "~/components/ui/table"
import TransactionTableRow from "~/components/transactions/TransactionTableRow"
import { useDebounce } from "~/hooks/useDebounce"
import { usePagination } from "~/hooks/usePagination"
import { useGetAllTransactionsQuery, useGetTransactionCountQuery } from "~/services/transaction"
import { formatRupiah } from "~/utils/format"

export default function Transaction() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const { page, size, handlePageChange, handlePageSizeChange, resetPage } = usePagination(5)

  const currentYear = new Date().getFullYear()
  const debouncedSearch = useDebounce(searchQuery, 500)
  const trimmedSearch = debouncedSearch.trim()
  const isDebouncing = searchQuery.trim() !== trimmedSearch

  const filterKey = `${trimmedSearch}|${typeFilter}|${statusFilter}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)

  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    resetPage()
  }

  const effectivePage = filterKey !== prevFilterKey ? 1 : page

  const { data: countRes, refetch: refetchCount } = useGetTransactionCountQuery(currentYear)
  const {
    data: transactionsRes,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useGetAllTransactionsQuery({
    search: trimmedSearch || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    page: effectivePage,
    size
  })

  const txStats = countRes?.data
  const transactions = transactionsRes?.data ?? []
  const pagination = transactionsRes?.paginate
  const hasActiveFilter = Boolean(searchQuery.trim() || typeFilter || statusFilter)
  const isTableUpdating = isFetching || isDebouncing

  const handleResetFilters = () => {
    setSearchQuery("")
    setTypeFilter("")
    setStatusFilter("")
    resetPage()
  }

  if (isLoading && !transactionsRes) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={4}
          contentVariant="list"
        />
      </div>
    )
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Transaction Management</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Monitor automatic payments via Midtrans Payment Gateway, membership subscriptions, and PT bookings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CardStats
          topIcon={<Receipt className="text-gray-300" />}
          label={`REVENUE (${currentYear})`}
          subLabel="Total paid transactions"
          value={`Rp ${formatRupiah(txStats?.sumTransactionYearly ?? 0)}`}
        />
        <CardStats
          topIcon={<CheckCircle2 className="text-emerald-400" />}
          label="SUCCESSFUL TRANSACTIONS"
          subLabel="Status: Success"
          value={txStats?.transactionSuccess ?? 0}
        />
        <CardStats
          topIcon={<Hourglass className="text-amber-400" />}
          label="AWAITING PAYMENT"
          subLabel="Status: Process"
          value={txStats?.transactionProcess ?? 0}
        />
        <CardStats
          topIcon={<XCircle className="text-red-400" />}
          label="FAILED / CANCELLED"
          subLabel="Failure / Cancelled"
          value={txStats?.transactionFailed ?? 0}
        />
      </div>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-col gap-4 p-5 sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary h-2.5 w-2.5 rounded-full" />
                <h3 className="text-[15px] font-bold text-white">Transaction History</h3>
              </div>
              {isTableUpdating && (
                <span className="text-text-muted inline-flex items-center gap-1.5 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating...
                </span>
              )}
            </div>

            <span className="text-text-muted text-[12px]">
              Total Transactions: <strong className="text-white tabular-nums">{pagination?.totalData ?? transactions.length}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative w-full lg:flex-1">
              <Input
                type="text"
                placeholder="Search by Order ID, member name, or email..."
                className="placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="text-text-muted cursor-pointer rounded-md p-0.5 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <Search className="text-text-muted pointer-events-none h-4 w-4" />
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:w-44">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
                >
                  <option
                    value=""
                    className="bg-[#16181D]"
                  >
                    All Types
                  </option>
                  <option
                    value="MEMBERSHIP"
                    className="bg-[#16181D]"
                  >
                    Membership
                  </option>
                  <option
                    value="TRAINER"
                    className="bg-[#16181D]"
                  >
                    PT Booking
                  </option>
                </Select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <ChevronDown className="text-text-muted h-4 w-4" />
                </div>
              </div>

              <div className="relative w-full sm:w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
                >
                  <option
                    value=""
                    className="bg-[#16181D]"
                  >
                    All Statuses
                  </option>
                  <option
                    value="SUCCESS"
                    className="bg-[#16181D]"
                  >
                    Success
                  </option>
                  <option
                    value="PROCESS"
                    className="bg-[#16181D]"
                  >
                    Processing
                  </option>
                  <option
                    value="PENDING"
                    className="bg-[#16181D]"
                  >
                    Pending
                  </option>
                  <option
                    value="EXPIRED"
                    className="bg-[#16181D]"
                  >
                    Expired
                  </option>
                  <option
                    value="CANCELLED"
                    className="bg-[#16181D]"
                  >
                    Cancelled
                  </option>
                  <option
                    value="FAILURE"
                    className="bg-[#16181D]"
                  >
                    Failure
                  </option>
                  <option
                    value="CHALLENGE"
                    className="bg-[#16181D]"
                  >
                    Challenge
                  </option>
                </Select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <ChevronDown className="text-text-muted h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-5">
          {isError ? (
            <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm text-red-400">Failed to load transaction data.</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    refetch()
                    refetchCount()
                  }}
                >
                  Try Again
                </Button>
                {hasActiveFilter && (
                  <Button
                    variant="secondary"
                    onClick={handleResetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={`transition-opacity duration-200 ${isTableUpdating ? "pointer-events-none opacity-60" : "opacity-100"}`}>
              <Table
                meta={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                entityName="transactions"
              >
                <TableHead>
                  <TableTR isHeader={true}>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBER</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">TRANSACTION TYPE</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">AMOUNT</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MIDTRANS ORDER ID</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS</div>
                    </TableTH>
                  </TableTR>
                </TableHead>

                <TableBody>
                  {!transactions.length ? (
                    <TableTR hideRowNumber>
                      <TableTD colSpan={6}>
                        <div className="text-text-muted flex min-h-72 w-full flex-col items-center justify-center gap-3 text-center text-sm">
                          <Receipt className="h-8 w-8 opacity-30" />
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-white/80">
                              {hasActiveFilter ? "No transactions match your filters" : "No transaction data available"}
                            </span>
                            <span className="text-xs">
                              {hasActiveFilter
                                ? "Try changing your search keywords or status filter."
                                : "Member payment transactions will be recorded automatically here."}
                            </span>
                          </div>
                          {hasActiveFilter && (
                            <Button
                              variant="secondary"
                              onClick={handleResetFilters}
                            >
                              Reset Filters
                            </Button>
                          )}
                        </div>
                      </TableTD>
                    </TableTR>
                  ) : (
                    transactions.map((trx, index) => (
                      <TransactionTableRow
                        key={trx.id}
                        transaction={trx}
                        isEven={index % 2 === 0}
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
