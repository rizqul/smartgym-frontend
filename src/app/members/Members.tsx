import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Award,
  CalendarClock,
  ChevronDown,
  Loader2,
  MinusCircle,
  Pencil,
  Search,
  ShieldExclamationPoint,
  Trash2,
  UserGroup,
  UserPlus,
  Users,
  X
} from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import { Table, TableHead, TableBody, TableTR, TableTH, TableTD } from "~/components/ui/table"
import LocalDate from "~/components/ui/LocalDate"
import Badge from "~/components/ui/Badge"
import Avatar from "~/components/ui/Avatar"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { Alert } from "~/utils/alert"
import { useDebounce } from "~/hooks/useDebounce"
import { usePagination } from "~/hooks/usePagination"
import { useGetAllMemberQuery, useDeleteMemberMutation, useGetMemberCountQuery } from "~/services/member"

type StatusFilter = "all" | "active" | "expired"

const isMembershipActive = (expiredAt: string | null | undefined, now: number) => Boolean(expiredAt && new Date(expiredAt).getTime() > now)

export default function Member() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { page, size, setPage, handlePageChange, handlePageSizeChange, resetPage } = usePagination(5)

  const debouncedSearch = useDebounce(searchQuery, 500)
  const trimmedSearch = debouncedSearch.trim()
  const isDebouncing = searchQuery.trim() !== trimmedSearch

  const filterKey = `${trimmedSearch}|${statusFilter}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)

  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    resetPage()
  }

  const effectivePage = filterKey !== prevFilterKey ? 1 : page

  const [deleteMember] = useDeleteMemberMutation()
  const { data: countRes, refetch: refetchCount } = useGetMemberCountQuery()

  const membershipParam = statusFilter === "active" ? true : statusFilter === "expired" ? false : undefined

  const { data, isLoading, isFetching, isError, refetch } = useGetAllMemberQuery({
    search: trimmedSearch || undefined,
    membership: membershipParam,
    page: effectivePage,
    size
  })

  const members = data?.data ?? []
  const memberStats = countRes?.data
  const hasSearch = searchQuery.trim().length > 0
  const hasActiveFilter = hasSearch || statusFilter !== "all"
  const isTableUpdating = isFetching || isDebouncing

  if (isLoading && !data) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={4}
          contentVariant="list"
        />
      </div>
    )
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    resetPage()
  }

  const handleDelete = async (id: string, name: string) => {
    const result = await Alert.confirm({
      title: "Delete Member?",
      text: `Are you sure you want to delete member "${name}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      isDanger: true
    })

    if (!result.isConfirmed) return

    setDeletingId(id)
    try {
      await deleteMember(id).unwrap()
      toast.success(`Member ${name} was deleted successfully!`)
      refetchCount()

      if (members.length === 1 && effectivePage > 1) {
        setPage(effectivePage - 1)
      }
    } catch (error: unknown) {
      const apiErr = error as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Failed to delete member.")
    } finally {
      setDeletingId(null)
    }
  }

  const now = Date.now()

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Member Management</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Manage member records, membership status, and account registration in the SmartGym ecosystem.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => navigate("/dashboard/members/create")}
          className="w-full shrink-0 whitespace-nowrap sm:w-auto"
        >
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<CalendarClock className="text-blue-400" />}
          label="Total Members"
          subLabel="All-Time"
          value={memberStats?.memberCount ?? 0}
        />
        <CardStats
          topIcon={<Award className="text-green-400" />}
          bottomIcon={<UserGroup className="text-green-400" />}
          label="Active Memberships"
          subLabel="Total Active"
          value={memberStats?.memberActiveCount ?? 0}
        />
        <CardStats
          topIcon={<MinusCircle className="text-red-400" />}
          bottomIcon={<ShieldExclamationPoint className="text-red-400" />}
          label="Expired / Inactive"
          subLabel="Total Inactive"
          value={memberStats?.memberInactiveCount ?? 0}
        />
        <CardStats
          topIcon={<Users className="text-yellow-400" />}
          bottomIcon={<UserPlus className="text-yellow-400" />}
          label="New Members"
          subLabel="Last 30 Days"
          value={memberStats?.newMemberCount ?? 0}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-80">
              <Input
                type="text"
                icon={Search}
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2.5 text-[13px]"
                rightElement={
                  hasSearch ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="text-text-muted cursor-pointer rounded-md p-0.5 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                rightElement={<ChevronDown className="text-text-muted pointer-events-none h-4 w-4" />}
              >
                <option
                  value="all"
                  className="bg-[#16181D]"
                >
                  All Statuses
                </option>
                <option
                  value="active"
                  className="bg-[#16181D]"
                >
                  Active Membership
                </option>
                <option
                  value="expired"
                  className="bg-[#16181D]"
                >
                  Expired / Inactive
                </option>
              </Select>
            </div>
          </div>

          {isTableUpdating && (
            <span className="text-text-muted inline-flex shrink-0 items-center gap-1.5 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating...
            </span>
          )}
        </div>

        {isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-red-400">Failed to load member data.</p>
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
              meta={data?.paginate}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              entityName="members"
            >
              <TableHead>
                <TableTR isHeader={true}>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBER DETAILS</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">CONTACT</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBERSHIP STATUS</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">JOINED</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-right text-[11px] font-bold tracking-wider uppercase">ACTIONS</div>
                  </TableTH>
                </TableTR>
              </TableHead>

              <TableBody>
                {!members.length ? (
                  <TableTR hideRowNumber>
                    <TableTD colSpan={6}>
                      <div className="text-text-muted flex min-h-72 w-full flex-col items-center justify-center gap-3 text-center text-sm">
                        <Users className="h-8 w-8 opacity-30" />
                        <span>No members found</span>
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
                  members.map((member, index) => {
                    const isActive = isMembershipActive(member.membershipExpiredAt, now)
                    const hasPackage = Boolean(member.membershipExpiredAt)
                    const isDeleting = deletingId === member.id

                    return (
                      <TableTR
                        key={member.id}
                        isEven={index % 2 === 0}
                      >
                        <TableTD>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={member.profileUrl}
                              name={member.name}
                              className="h-10 w-10 shrink-0 rounded-xl border border-white/10 shadow-sm"
                            />
                            <span className="truncate text-[14px] font-bold text-white">{member.name}</span>
                          </div>
                        </TableTD>

                        <TableTD>
                          <div className="flex flex-col">
                            <span className="text-[13px] text-white">{member.email}</span>
                            <span className="text-[12px] font-medium tracking-wide whitespace-nowrap text-[#A28F79]">
                              {member.phoneNumber || "-"}
                            </span>
                          </div>
                        </TableTD>

                        <TableTD>
                          <div className="flex flex-col items-start gap-1">
                            <Badge
                              variant={isActive ? "yellow" : "plain"}
                              label={isActive ? "Active" : hasPackage ? "Expired" : "Not Active"}
                              icon={<div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-yellow-400" : "bg-gray-400"}`} />}
                            />
                            <span className="text-text-muted text-[11px] whitespace-nowrap">
                              {hasPackage ? (
                                <>
                                  until{" "}
                                  <LocalDate
                                    date={member.membershipExpiredAt}
                                    variant="default"
                                  />
                                </>
                              ) : (
                                "No membership package"
                              )}
                            </span>
                          </div>
                        </TableTD>

                        <TableTD>
                          <LocalDate
                            date={member.createdAt}
                            variant="default"
                            className="text-[13px] whitespace-nowrap text-white"
                          />
                        </TableTD>

                        <TableTD>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => navigate(`${member.id}/edit`, { state: { member } })}
                              title="Edit Member"
                              aria-label={`Edit ${member.name}`}
                              className="text-text-muted hover:text-primary cursor-pointer rounded-lg p-2 transition-colors hover:bg-white/5"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(member.id, member.name)}
                              disabled={isDeleting}
                              title="Delete Member"
                              aria-label={`Delete ${member.name}`}
                              className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </TableTD>
                      </TableTR>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
