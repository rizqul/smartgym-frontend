import { useState } from "react"
import { useNavigate } from "react-router"
import { CircleUser, Loader2, Pencil, Search, ShieldCheck, Trash2, TrendingUp, UserPlus, Users, X } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "~/components/ui/Button"
import { CardStats } from "~/components/ui/CardStats"
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

  const debouncedSearch = useDebounce(searchQuery, 500)
  const [deleteStaff] = useDeleteStaffMutation()

  const { data: countRes } = useGetStaffCountQuery()
  const { data, isLoading, isFetching, isError, refetch } = useGetAllStaffQuery({
    name: debouncedSearch,
    page: currentPage
  })

  const staffs = data?.data ?? []
  const totalStaffs = countRes?.data?.staffCount ?? 0
  const hasSearch = searchQuery.trim().length > 0

  if (isLoading) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={1}
          contentVariant="list"
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-red-400">Gagal memuat data staf.</p>
        <Button
          variant="secondary"
          onClick={() => refetch()}
        >
          Coba Lagi
        </Button>
      </div>
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (url: string) => {
    try {
      const urlObj = new URL(url, window.location.origin)
      const pageParam = Number(urlObj.searchParams.get("page"))
      if (pageParam && pageParam !== currentPage) {
        setCurrentPage(pageParam)
      }
    } catch (e) {
      console.error("Gagal parse URL paginasi", e)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    const result = await Alert.confirm({
      title: "Hapus Staf?",
      text: `Apakah Anda yakin ingin menghapus staf "${name}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
      confirmText: "Ya, Hapus",
      isDanger: true
    })

    if (result.isConfirmed) {
      try {
        await deleteStaff(id).unwrap()
        toast.success(`Staf ${name} berhasil dihapus!`)
      } catch (error: unknown) {
        const apiErr = error as { data?: { message?: string }; message?: string }
        toast.error(apiErr?.data?.message || apiErr?.message || "Gagal menghapus staf.")
      }
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Manajemen Staf</h2>
          <p className="text-text-muted text-[13px] sm:text-[14px]">
            Kelola data staf, admin, dan hak akses dalam sistem operasional SmartGym.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<UserPlus className="h-4 w-4" />}
          onClick={() => navigate("/dashboard/staffs/create")}
          className="w-full shrink-0 whitespace-nowrap sm:w-auto"
        >
          Tambah Staf
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<CircleUser className="text-blue-400" />}
          label="Staf Terdaftar"
          subLabel="Total Keseluruhan"
          value={totalStaffs}
        />
        <CardStats
          topIcon={<ShieldCheck className="text-green-400" />}
          bottomIcon={<TrendingUp className="text-green-400" />}
          label="Staf Baru"
          subLabel="30 Hari Terakhir"
          value={2}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-80">
            <Input
              type="text"
              icon={Search}
              placeholder="Cari nama staf..."
              value={searchQuery}
              onChange={handleSearch}
              className="py-2.5 text-[13px]"
              rightElement={
                hasSearch ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setCurrentPage(1)
                    }}
                    aria-label="Hapus pencarian"
                    className="text-text-muted cursor-pointer rounded-md p-0.5 hover:bg-white/10 hover:text-white"
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
              Memperbarui...
            </span>
          )}
        </div>

        <div className={`transition-opacity duration-200 ${isFetching ? "pointer-events-none opacity-60" : "opacity-100"}`}>
          <Table
            meta={data?.paginate}
            onPageChange={handlePageChange}
          >
            <TableHead>
              <TableTR isHeader={true}>
                <TableTH>
                  <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">DETAIL STAF</div>
                </TableTH>
                <TableTH>
                  <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">KONTAK</div>
                </TableTH>
                <TableTH>
                  <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">BERGABUNG</div>
                </TableTH>
                <TableTH>
                  <div className="text-text-muted text-right text-[11px] font-bold tracking-wider uppercase">AKSI</div>
                </TableTH>
              </TableTR>
            </TableHead>

            <TableBody>
              {!staffs.length ? (
                <TableTR>
                  <TableTD colSpan={4}>
                    <div className="text-text-muted flex min-h-72 w-full flex-col items-center justify-center gap-3 text-center text-sm">
                      <Users className="h-8 w-8 opacity-30" />
                      <span>Tidak ada staf ditemukan</span>
                      {hasSearch && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSearchQuery("")
                            setCurrentPage(1)
                          }}
                        >
                          Reset Pencarian
                        </Button>
                      )}
                    </div>
                  </TableTD>
                </TableTR>
              ) : (
                staffs.map((staff, index) => (
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
                        <span className="text-[12px] font-medium tracking-wide text-[#A28F79]">{staff.phoneNumber || "-"}</span>
                      </div>
                    </TableTD>

                    <TableTD>
                      <LocalDate
                        date={staff.createdAt}
                        variant="default"
                        className="text-[13px] text-white"
                      />
                    </TableTD>

                    <TableTD>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/staffs/${staff.id}/edit`, { state: { staff } })}
                          title="Edit Data"
                          aria-label={`Edit ${staff.name}`}
                          className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(staff.id, staff.name)}
                          title="Hapus Staf"
                          aria-label={`Hapus ${staff.name}`}
                          className="text-text-muted cursor-pointer rounded-lg p-2 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableTD>
                  </TableTR>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
