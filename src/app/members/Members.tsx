import { useNavigate } from "react-router"
import {
  ChevronDown,
  Download,
  Search,
  TrendingUp,
  UserPlus,
  Users,
  Eye,
  Pencil,
  History,
  Award,
  MinusCircle
} from "lucide-react"

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

import { MOCK_MEMBERS } from "../../data/mockMembers"

export default function Member() {
  const navigate = useNavigate()

  return (
    <div className="border-primary/20 mt-8 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-150 flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Member</h2>
          <p className="text-text-muted text-[14px]">
            Kelola data master member, status membership, riwayat dan pendaftaran akun dalam ekosistem SmartGym.
          </p>
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
            onClick={() => navigate("/dashboard/members/create")}
          >
            Tambah Member Baru
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
                placeholder="Cari nama member, email, atau ID..."
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

        <Table>
          <TableHead>
            <TableTR isHeader={true}>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBER DETAILS</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">KONTAK</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS AKUN</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS MEMBERSHIP</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">PAKET TERAKHIR</div>
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
            {MOCK_MEMBERS.map((member, index) => (
              <TableTR
                key={member.id}
                isEven={index % 2 === 0}
              >
                <TableTD>
                  <div className="flex items-center gap-3">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full border border-white/10 object-cover shadow-sm"
                      />
                    ) : (
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold ${member.avatarBg}`}>
                        {member.initials}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-white">{member.name}</span>
                      <span className="text-primary text-[12px] font-semibold">{member.id}</span>
                    </div>
                  </div>
                </TableTD>

                <TableTD>
                  <div className="flex flex-col">
                    <span className="text-[13px] text-white">{member.email}</span>
                    <span className="text-[12px] font-medium tracking-wide text-[#A28F79]">{member.phone}</span>
                  </div>
                </TableTD>

                <TableTD>
                  <Badge
                    variant={member.accountStatus === "Active" ? "yellow" : "plain"}
                    label={member.accountStatus}
                    icon={
                      <div className={`h-1.5 w-1.5 rounded-full ${member.accountStatus === "Active" ? "bg-yellow-400" : "bg-gray-400"}`} />
                    }
                  />
                </TableTD>

                <TableTD>
                  <Badge
                    variant={member.membershipStatus === "Active Pass" ? "orange" : "plain"}
                    label={member.membershipStatus}
                    icon={
                      member.membershipStatus === "Active Pass" ? (
                        <Award className="h-3.5 w-3.5" />
                      ) : (
                        <MinusCircle className="h-3.5 w-3.5" />
                      )
                    }
                  />
                </TableTD>

                <TableTD>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">{member.package}</span>
                    <span className="text-text-muted text-[12px]">{member.expDate}</span>
                  </div>
                </TableTD>

                <TableTD>
                  <span className="text-[13px] text-white">{member.joinDate}</span>
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
                      onClick={() => navigate(`/dashboard/members/${member.id.replace("#", "")}/edit`)}
                      className="transition-colors hover:text-white"
                      title="Edit Data"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="transition-colors hover:text-white"
                      title="Riwayat"
                    >
                      <History className="h-5 w-5" />
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
