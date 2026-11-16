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

import { MOCK_STAFF } from "../../data/mockStaffs"

export default function Staff() {
  const navigate = useNavigate()

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-150 flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Staf</h2>
          <p className="text-text-muted text-[14px]">Kelola data staf, admin, dan hak akses dalam sistem operasional SmartGym.</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Data
          </Button>
          <Button
            variant="primary"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={() => navigate("/dashboard/staffs/create")}
          >
            Tambah Staf Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CardStats
          topIcon={<Users className="text-blue-400" />}
          bottomIcon={<TrendingUp className="text-blue-400" />}
          label="Staf Terdaftar"
          subLabel="Total Keseluruhan"
          value={124}
        />
        <CardStats
          topIcon={<ShieldCheck className="text-green-400" />}
          bottomIcon={<TrendingUp className="text-green-400" />}
          label="Staf Aktif"
          subLabel="Bulan Ini"
          value={118}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[320px]">
              <Input
                type="text"
                placeholder="Cari nama staf, email, atau ID..."
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
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <ChevronDown className="text-text-muted h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <Table>
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
            {MOCK_STAFF.map((staff, index) => (
              <TableTR
                key={staff.id}
                isEven={index % 2 === 0}
              >
                <TableTD>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold ${staff.avatarBg}`}>
                      {staff.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-white">{staff.name}</span>
                      <span className="text-primary text-[12px] font-semibold">{staff.id}</span>
                    </div>
                  </div>
                </TableTD>

                <TableTD>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-white">{staff.email}</span>
                    <span className="text-[12px] font-medium tracking-wide text-[#A28F79]">{staff.phone}</span>
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
                    variant={staff.accountStatus === "Active" ? "yellow" : "plain"}
                    label={staff.accountStatus}
                    icon={
                      <div className={`h-1.5 w-1.5 rounded-full ${staff.accountStatus === "Active" ? "bg-yellow-400" : "bg-gray-400"}`} />
                    }
                  />
                </TableTD>

                <TableTD>
                  <span className="text-[13px] text-white">{staff.joinDate}</span>
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
                      onClick={() => navigate(`/dashboard/staffs/${staff.id.replace("#", "")}/edit`)}
                      className="transition-colors hover:text-white"
                      title="Edit Data"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="transition-colors hover:text-white"
                      title="Riwayat"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </TableTD>
              </TableTR>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
