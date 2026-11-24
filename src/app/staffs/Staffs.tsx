import { useState } from "react"
import { useNavigate } from "react-router"
import { Loader2, Pencil, Search, Trash2, UserPlus, Users, X } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { Table, TableHead, TableBody, TableTR, TableTH, TableTD } from "~/components/ui/table"
import LocalDate from "~/components/ui/LocalDate"
import Avatar from "~/components/ui/Avatar"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { Alert } from "~/utils/alert"
import { useDebounce } from "~/hooks/useDebounce"
import { useGetAllStaffQuery, useGetStaffCountQuery, useDeleteStaffMutation } from "~/services/staff"

export default function Staff() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(searchQuery, 500)
  const trimmedSearch = debouncedSearch.trim()
  const isDebouncing = searchQuery.trim() !== trimmedSearch

  const [prevSearch, setPrevSearch] = useState(trimmedSearch)
  if (trimmedSearch !== prevSearch) {
    setPrevSearch(trimmedSearch)
    setCurrentPage(1)
  }

  const effectivePage = trimmedSearch !== prevSearch ? 1 : currentPage

  const [deleteStaff] = useDeleteStaffMutation()
  const { data: countRes, refetch: refetchCount } = useGetStaffCountQuery()
  const { data, isLoading, isFetching, isError, refetch } = useGetAllStaffQuery({
    search: trimmedSearch || undefined,
    page: effectivePage
  })

  const staffs = data?.data ?? []
  const totalStaffs = countRes?.data?.staffCount ?? 0
  const hasSearch = searchQuery.trim().length > 0
  const isTableUpdating = isFetching || isDebouncing

  if (isLoading && !data) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={0}
          contentVariant="list"
        />
      </div>
    )
  }

  const handlePageChange = (url: string) => {
    try {
      const urlObj = new URL(url, window.location.origin)
      const pageParam = Number(urlObj.searchParams.get("page"))
      if (Number.isInteger(pageParam) && pageParam >= 1 && pageParam !== effectivePage) {
        setCurrentPage(pageParam)
      }
    } catch (e) {
      console.error("Failed to parse pagination URL", e)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    const result = await Alert.confirm({
      title: "Delete Staff?",
      text: `Are you sure you want to delete staff "${name}"? Deleted data cannot be recovered.`,
      confirmText: "Yes, Delete",
      isDanger: true
    })

    if (!result.isConfirmed) return

    setDeletingId(id)
    try {
      await deleteStaff(id).unwrap()
      toast.success(`Staff ${name} deleted successfully!`)
      refetchCount()

      if (staffs.length === 1 && effectivePage > 1) {
        setCurrentPage(effectivePage - 1)
      }
    } catch (error: unknown) {
      const apiErr = error as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Failed to delete staff.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Staff Management</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Manage staff data, admins, and access permissions in SmartGym&apos;s operational system.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => navigate("/dashboard/staffs/create")}
          className="w-full shrink-0 whitespace-nowrap sm:w-auto"
        >
          Add Staff
        </Button>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {isTableUpdating && (
              <span className="text-text-muted inline-flex shrink-0 items-center gap-1.5 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </span>
            )}

            <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-[#111318] px-3.5 py-2 text-[13px]">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-text-muted">Total Staff:</span>
              <span className="font-bold text-white tabular-nums">{totalStaffs}</span>
            </div>
          </div>
        </div>

        {isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-red-400">Failed to load staff data.</p>
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
              {hasSearch && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("")
                    setCurrentPage(1)
                  }}
                >
                  Reset Search
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className={`transition-opacity duration-200 ${isTableUpdating ? "pointer-events-none opacity-60" : "opacity-100"}`}>
            <Table
              meta={data?.paginate}
              onPageChange={handlePageChange}
              entityName="staff"
            >
              <TableHead>
                <TableTR isHeader={true}>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STAFF DETAILS</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">CONTACT</div>
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
                {!staffs.length ? (
                  <TableTR hideRowNumber>
                    <TableTD colSpan={5}>
                      <div className="text-text-muted flex min-h-72 w-full flex-col items-center justify-center gap-3 text-center text-sm">
                        <Users className="h-8 w-8 opacity-30" />
                        <span>No staff found</span>
                        {hasSearch && (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setSearchQuery("")
                              setCurrentPage(1)
                            }}
                          >
                            Reset Search
                          </Button>
                        )}
                      </div>
                    </TableTD>
                  </TableTR>
                ) : (
                  staffs.map((staff, index) => {
                    const isDeleting = deletingId === staff.id

                    return (
                      <TableTR
                        key={staff.id}
                        isEven={index % 2 === 0}
                      >
                        <TableTD>
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={staff.profileUrl}
                              name={staff.name}
                              className="h-10 w-10 shrink-0 rounded-xl border border-white/10 shadow-sm"
                            />
                            <span className="truncate text-[14px] font-bold text-white">{staff.name}</span>
                          </div>
                        </TableTD>

                        <TableTD>
                          <div className="flex flex-col">
                            <span className="text-[13px] text-white">{staff.email}</span>
                            <span className="text-[12px] font-medium tracking-wide whitespace-nowrap text-[#A28F79]">
                              {staff.phoneNumber || "-"}
                            </span>
                          </div>
                        </TableTD>

                        <TableTD>
                          <LocalDate
                            date={staff.createdAt}
                            variant="default"
                            className="text-[13px] whitespace-nowrap text-white"
                          />
                        </TableTD>

                        <TableTD>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => navigate(`/dashboard/staffs/${staff.id}/edit`, { state: { staff } })}
                              disabled={isDeleting}
                              title="Edit Staff"
                              aria-label={`Edit ${staff.name}`}
                              className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(staff.id, staff.name)}
                              disabled={isDeleting}
                              title="Delete Staff"
                              aria-label={`Delete ${staff.name}`}
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
