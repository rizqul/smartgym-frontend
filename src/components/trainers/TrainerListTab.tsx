import { useState } from "react"
import { useNavigate } from "react-router"
import { Dumbbell, Search, ChevronDown, Calendar, Wallet, Pencil, CheckCircle2, Clock } from "lucide-react"

import { Input } from "~/components/ui/Input"
import { Select } from "~/components/ui/Select"
import Table from "~/components/ui/Table"
import TableHead from "~/components/ui/TableHead"
import TableTR from "~/components/ui/TableTR"
import TableTH from "~/components/ui/TableTH"
import TableBody from "~/components/ui/TableBody"
import TableTD from "~/components/ui/TableTD"
import { getAvatarUrl } from "~/utils/avatar"

interface TrainerListTabProps {
  onViewSchedule: () => void
}

interface TrainerItem {
  id: string
  code: string
  name: string
  employmentType: "Full-Time" | "Freelance"
  profileUrl?: string | null
  status: "on-duty" | "off" | "fully-booked"
  statusLabel: string
  quotaText: string
  activeClients: number
  completedSessions: number
  commissionAmount: number
  commissionRate: number
  payoutStatus: "ready" | "pending"
}

const DUMMY_TRAINERS: TrainerItem[] = [
  {
    id: "1",
    code: "#TRN-001",
    name: "Rio 'The Titan' Santoso",
    employmentType: "Full-Time",
    status: "on-duty",
    statusLabel: "On-Duty (Shift 10:00-19:00)",
    quotaText: "Kuota: 6 / 6 Terjadwal",
    activeClients: 18,
    completedSessions: 74,
    commissionAmount: 18200000,
    commissionRate: 40,
    payoutStatus: "ready"
  },
  {
    id: "2",
    code: "#TRN-007",
    name: "Dave Alexander",
    employmentType: "Freelance",
    status: "on-duty",
    statusLabel: "On-Duty (Standby Floor)",
    quotaText: "Kuota: 4 / 5 Terjadwal",
    activeClients: 12,
    completedSessions: 52,
    commissionAmount: 11500000,
    commissionRate: 35,
    payoutStatus: "ready"
  },
  {
    id: "3",
    code: "#TRN-011",
    name: "Nadia Safitri",
    employmentType: "Full-Time",
    status: "on-duty",
    statusLabel: "On-Duty (Shift Sore 16:30)",
    quotaText: "Kuota: 3 / 4 Terjadwal",
    activeClients: 9,
    completedSessions: 38,
    commissionAmount: 7200000,
    commissionRate: 30,
    payoutStatus: "ready"
  },
  {
    id: "4",
    code: "#TRN-015",
    name: "Rendy Prasetya",
    employmentType: "Freelance",
    status: "off",
    statusLabel: "Off / Istirahat (Kembali Besok)",
    quotaText: "Kuota: 0 / 0 Hari Ini",
    activeClients: 11,
    completedSessions: 46,
    commissionAmount: 9800000,
    commissionRate: 35,
    payoutStatus: "ready"
  },
  {
    id: "5",
    code: "#TRN-019",
    name: "Jonathan 'Jo' Lim",
    employmentType: "Full-Time",
    status: "fully-booked",
    statusLabel: "Sesi Penuh (Fully Booked)",
    quotaText: "Kuota: 6 / 6 Selesai",
    activeClients: 20,
    completedSessions: 82,
    commissionAmount: 20400000,
    commissionRate: 40,
    payoutStatus: "pending"
  }
]

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount)

export default function TrainerListTab({ onViewSchedule }: TrainerListTabProps) {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredTrainers = DUMMY_TRAINERS.filter((trainer) => {
    const matchSearch =
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) || trainer.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter ? trainer.status === statusFilter : true
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#1C1F26] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full flex-1">
          <Input
            type="text"
            placeholder="Cari nama trainer, spesialisasi, atau ID (#TRN-xxx)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <Search className="text-text-muted h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-40">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-9 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
            >
              <option value="">Semua Status</option>
              <option value="on-duty">On-Duty</option>
              <option value="fully-booked">Fully Booked</option>
              <option value="off">Off / Istirahat</option>
            </Select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDown className="text-text-muted h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0C10] px-4 py-2.5 text-[13px] font-medium text-white">
            <span>Oktober 2024 (Aktif)</span>
            <Calendar className="text-text-muted h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col justify-between gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-2.5 w-2.5 rounded-full" />
              <h3 className="text-[15px] font-bold text-white">Daftar Trainer Sesi PT</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[11px] font-medium text-amber-200/80">
              Periode: Oktober 2024
            </span>
          </div>

          <div className="text-text-muted flex flex-wrap items-center gap-4 text-[12px]">
            <span>
              Total Trainer Aktif: <strong className="text-white">24</strong>
            </span>
            <span className="hidden text-white/10 sm:inline">|</span>
            <span>
              Akumulasi Komisi: <strong className="text-primary">Rp 68.450.000</strong>
            </span>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableTR isHeader={true}>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">INFO TRAINER</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">STATUS &amp; SHIFT</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-center text-[11px] font-bold tracking-wider uppercase">KLIEN &amp; SESI</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">SKEMA &amp; KOMISI BLN INI</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-right text-[11px] font-bold tracking-wider uppercase">AKSI &amp; PAYROLL</div>
              </TableTH>
            </TableTR>
          </TableHead>

          <TableBody>
            {!filteredTrainers.length ? (
              <TableTR>
                <TableTD colSpan={5}>
                  <div className="text-text-muted flex min-h-90 w-full flex-col items-center justify-center gap-2 text-center text-sm">
                    <Dumbbell className="h-8 w-8 opacity-30" />
                    <span>Tidak ada trainer ditemukan</span>
                  </div>
                </TableTD>
              </TableTR>
            ) : (
              filteredTrainers.map((trainer, index) => (
                <TableTR
                  key={trainer.id}
                  isEven={index % 2 === 0}
                >
                  <TableTD>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={getAvatarUrl(trainer.name, trainer.profileUrl)}
                          alt={trainer.name}
                          className="h-10 w-10 rounded-xl border border-white/10 object-cover shadow-sm"
                        />
                        <span
                          className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#1C1F26] ${
                            trainer.status === "off" ? "bg-gray-500" : "bg-amber-400"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-white">{trainer.name}</span>
                        <span className="text-text-muted text-[12px]">
                          {trainer.code} • {trainer.employmentType}
                        </span>
                      </div>
                    </div>
                  </TableTD>

                  <TableTD>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          trainer.status === "off" ? "bg-white/5 text-gray-400" : "bg-amber-500/10 text-amber-300"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${trainer.status === "off" ? "bg-gray-400" : "bg-amber-400"}`} />
                        {trainer.statusLabel}
                      </span>
                      <span className="text-text-muted text-[12px]">{trainer.quotaText}</span>
                    </div>
                  </TableTD>

                  <TableTD>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-[13px] font-bold text-white">{trainer.activeClients} Member</span>
                      <span className="text-[12px] font-medium text-sky-400">{trainer.completedSessions} Sesi Selesai</span>
                    </div>
                  </TableTD>

                  <TableTD>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-white">{formatRupiah(trainer.commissionAmount)}</span>
                        <span className="text-text-muted text-[12px]">({trainer.commissionRate}%)</span>
                      </div>
                      {trainer.payoutStatus === "ready" ? (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-sky-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Siap Cair (Payout)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-amber-300">
                          <Clock className="h-3.5 w-3.5" />
                          Menunggu Tutup Buku
                        </span>
                      )}
                    </div>
                  </TableTD>

                  <TableTD>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={onViewSchedule}
                        title="Lihat Jadwal"
                        className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2 text-sky-400 transition-colors hover:bg-sky-500/20"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Proses Payout"
                        className="bg-primary hover:bg-primary/90 rounded-lg p-2 text-black transition-colors"
                      >
                        <Wallet className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/trainers/${trainer.id}/edit`)}
                        title="Edit Trainer"
                        className="text-text-muted rounded-lg p-2 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
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
