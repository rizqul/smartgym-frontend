import { useState } from "react"
import { useNavigate } from "react-router"
import { ChevronDown, Download, Search, TrendingUp, UserPlus, Users, Eye, Pencil, Trash, ShieldCheck } from "lucide-react"

import { Button } from "../../components/ui/Button"
import { CardStats } from "../../components/ui/CardStats"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import Table from "../../components/ui/Table"
import TableHead from "../../components/ui/TableHead"
import TableTR from "../../components/ui/TableTR"
import TableTH from "../../components/ui/TableTH"
import TableBody from "../../components/ui/TableBody"
import TableTD from "../../components/ui/TableTD"
import Badge from "../../components/ui/Badge"
import LocalDate from "../../components/ui/LocalDate"

import { useGetAllStaffQuery } from "../../services/staff"
import { getAvatarUrl } from "../../utils/avatar"

export default function Staff() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isFetching } = useGetAllStaffQuery({
    name: searchQuery,
    page: currentPage,
    size: 10
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (url: string) => {
    try {
      const urlObj = new URL(url)
      const pageParam = urlObj.searchParams.get("page")
      if (pageParam) setCurrentPage(Number(pageParam))
    } catch (e) {
      console.error("Gagal parse URL", e)
    }
  }

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-150 flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Staf</h2>
          <p className="text-text-muted text-[14px]">Kelola data staf, admin, dan hak akses dalam sistem operasional SmartGym.</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button
            variant="secondary"
            leftIcon={<Download className="h-4 w-4" />}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            Export Data
          </Button>
          <Button
            variant="primary"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => navigate("/dashboard/staffs/create")}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            Tambah Staff
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Staf Terdaftar"
          subLabel="Total Keseluruhan"
          value={data?.paginate?.totalData || 0}
        />
        <CardStats
          topIcon={<ShieldCheck className="text-green-400" />}
          bottomIcon={<TrendingUp className="text-green-400" />}
          label="Staf Aktif"
          subLabel="Bulan Ini"
          value={data?.paginate?.totalData || 0}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[320px]">
              <Input
                type="text"
                placeholder="Cari nama staf..."
                value={searchQuery}
                onChange={handleSearch}
                className="placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <Search className="text-text-muted h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-45">
              <Select
                defaultValue=""
                className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
              >
                <option value="">Semua Peran</option>
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <ChevronDown className="text-text-muted h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

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
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">PERAN (ROLE)</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS AKUN</div>
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
            {isLoading || isFetching ? (
              <TableTR>
                <TableTD>
                  <div className="text-text-muted flex w-full justify-center py-4">Memuat data staf...</div>
                </TableTD>
              </TableTR>
            ) : data?.data?.length === 0 ? (
              <TableTR>
                <TableTD>
                  <div className="text-text-muted flex w-full justify-center py-4">Tidak ada staf ditemukan</div>
                </TableTD>
              </TableTR>
            ) : (
              data?.data.map((staff, index) => (
                <TableTR
                  key={staff.id}
                  isEven={index % 2 === 0}
                >
                  <TableTD>
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(staff.name, staff.profileUrl)}
                        alt={staff.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-white">{staff.name}</span>
                        <span className="text-primary text-[12px] font-semibold">#{staff.id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </TableTD>

                  <TableTD>
                    <div className="flex flex-col">
                      <span className="text-[13px] text-white">{staff.email}</span>
                      <span className="text-[12px] font-medium tracking-wide text-[#A28F79]">{staff.phoneNumber}</span>
                    </div>
                  </TableTD>

                  <TableTD>
                    <Badge
                      variant={staff.role === "ADMIN" ? "orange" : "plain"}
                      label={staff.role}
                      icon={<div className={`h-1.5 w-1.5 rounded-full ${staff.role === "ADMIN" ? "bg-orange-400" : "bg-gray-400"}`} />}
                    />
                  </TableTD>

                  <TableTD>
                    <Badge
                      variant="yellow"
                      label="Active"
                      icon={<div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />}
                    />
                  </TableTD>

                  <TableTD>
                    <LocalDate
                      date={staff.createdAt}
                      className="text-[13px] text-white"
                    />
                  </TableTD>

                  <TableTD>
                    <div className="text-text-muted flex items-center justify-end gap-4">
                      <button
                        className="transition-colors hover:text-white"
                        title="Lihat Detail"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/staffs/${staff.id}/edit`)}
                        className="transition-colors hover:text-white"
                        title="Edit Data"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        className="transition-colors hover:text-white"
                        title="Hapus"
                      >
                        <Trash className="h-5 w-5" />
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
  )
}
