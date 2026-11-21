import { useState } from "react"
import { useNavigate } from "react-router"
import { ChevronDown, Download, Search, TrendingUp, UserPlus, Users, Eye, Award, MinusCircle, Trash } from "lucide-react"

import { Button } from "../../components/ui/Button"
import { CardStats } from "../../components/ui/CardStats"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import { Table, TableHead, TableBody, TableTR, TableTH, TableTD } from "~/components/ui/table"
import LocalDate from "~/components/ui/LocalDate"
import Badge from "../../components/ui/Badge"
import toast from "react-hot-toast"
import { Alert } from "~/utils/alert"

import { useGetAllMemberQuery, useDeleteMemberMutation } from "~/services/member"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import { useDebounce } from "~/hooks/useDebounce"
import Avatar from "~/components/ui/Avatar"

export default function Member() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteMember] = useDeleteMemberMutation()
  const debouncedSearch = useDebounce(searchQuery, 500)

  const { data, isLoading, isFetching, isError, refetch } = useGetAllMemberQuery({
    name: debouncedSearch,
    page: currentPage
  })

  if (isLoading) {
    return (
      <PageSkeleton
        statCount={4}
        contentVariant="list"
      />
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-red-400">Gagal memuat data member.</p>
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
      const urlObj = new URL(url)
      const pageParam = urlObj.searchParams.get("page")
      if (pageParam) {
        setCurrentPage(Number(pageParam))
      }
    } catch (e) {
      console.error("Gagal membaca URL paginasi", e)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    const result = await Alert.confirm({
      title: "Hapus Member?",
      text: `Apakah Anda yakin ingin menghapus Member "${name}"? Data yang sudah dihapus tidak dapat dikembalikan.`,
      confirmText: "Ya, Hapus",
      isDanger: true
    })

    if (result.isConfirmed) {
      try {
        await deleteMember(id).unwrap()
        toast.success(`Member ${name} berhasil dihapus!`)
      } catch (error: any) {
        toast.error(error?.data?.message || "Gagal menghapus member.")
      }
    }
  }

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-150 flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Member</h2>
          <p className="text-text-muted text-[14px]">
            Kelola data master member, status membership, riwayat dan pendaftaran akun dalam ekosistem SmartGym.
          </p>
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
            onClick={() => navigate("/dashboard/members/create")}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            Tambah Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Total Terdaftar"
          subLabel="All-Time"
          value={2845}
        />
        <CardStats
          topIcon={<Award className="text-green-400" />}
          bottomIcon={<TrendingUp className="text-green-400" />}
          label="Membership Aktif"
          subLabel="Bulan Ini"
          value={1204}
        />
        <CardStats
          topIcon={<MinusCircle className="text-red-400" />}
          bottomIcon={<TrendingUp className="text-red-400" />}
          label="Akun Suspended"
          subLabel="Needs Action"
          value={42}
        />
        <CardStats
          topIcon={<Users className="text-yellow-400" />}
          bottomIcon={<TrendingUp className="text-yellow-400" />}
          label="Member Baru"
          subLabel="Minggu Ini"
          value={156}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[320px]">
              <Input
                type="text"
                placeholder="Cari nama member"
                className="placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
                value={searchQuery}
                onChange={handleSearch}
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
                <option value="">Semua Tier</option>
                <option value="active">Active Pass</option>
                <option value="suspended">Suspended</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <ChevronDown className="text-text-muted h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-opacity duration-200 ${isFetching ? "pointer-events-none opacity-60" : "opacity-100"}`}>
          <Table
            meta={data?.paginate}
            onPageChange={handlePageChange}
          >
            <TableHead>
              <TableTR isHeader={true}>
                <TableTH>
                  <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBER DETAILS</div>
                </TableTH>
                <TableTH>
                  <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">KONTAK</div>
                </TableTH>
                <TableTH>
                  <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS MEMBERSHIP</div>
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
              {!data?.data?.length ? (
                <TableTR>
                  <TableTD colSpan={4}>
                    <div className="text-text-muted flex min-h-130 w-full flex-col items-center justify-center gap-2 text-center text-sm">
                      <Users className="h-8 w-8 opacity-30" />
                      <span>Tidak ada member ditemukan</span>
                    </div>
                  </TableTD>
                </TableTR>
              ) : (
                data.data.map((member, index) => (
                  <TableTR
                    key={member.id}
                    isEven={index % 2 === 0}
                  >
                    <TableTD>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={member.profileUrl}
                          name={member.name}
                          className="h-10 w-10 rounded-xl shadow-sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-white">{member.name}</span>
                        </div>
                      </div>
                    </TableTD>

                    <TableTD>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-white">{member.email}</span>
                        <span className="text-[12px] font-medium tracking-wide text-[#A28F79]">{member.phoneNumber}</span>
                      </div>
                    </TableTD>

                    <TableTD>
                      {(() => {
                        const isActive = Boolean(member.membershipExpiredAt && new Date(member.membershipExpiredAt).getTime() > Date.now())

                        return (
                          <Badge
                            variant={isActive ? "yellow" : "plain"}
                            label={isActive ? "Aktif" : "Kadaluarsa"}
                            icon={<div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-yellow-400" : "bg-gray-400"}`} />}
                          />
                        )
                      })()}
                      <span className="text-text-muted text-[12px]">
                        {member.membershipExpiredAt ? (
                          <>
                            s.d: <LocalDate date={member.membershipExpiredAt} />
                          </>
                        ) : (
                          "Belum ada paket"
                        )}
                      </span>
                    </TableTD>

                    <TableTD>
                      <LocalDate
                        date={member.createdAt}
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
                        {/* <button
                          onClick={() => navigate(`/dashboard/members/${member.id.replace("#", "")}/edit`)}
                          className="transition-colors hover:text-white"
                          title="Edit Data"
                        >
                          <Pencil className="h-5 w-5" />
                        </button> */}
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
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
    </div>
  )
}
