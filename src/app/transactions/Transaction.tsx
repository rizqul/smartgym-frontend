import { useState } from "react"
import { ChevronDown, Search, Receipt, CheckCircle2, Hourglass, XCircle, Copy, Calendar } from "lucide-react"

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

import { getAvatarUrl } from "~/utils/avatar"
import { MOCK_TRANSACTION } from "~/data/mockTransaction"

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(angka)
}

export default function Transaction() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="border-primary/20 flex w-full flex-col gap-6 rounded-2xl p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-2xl flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Manajemen Transaksi</h2>
          <p className="text-text-muted text-[14px]">
            Monitoring pembayaran otomatis via Midtrans Payment Gateway, langganan membership, dan PT Booking.
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button
            variant="primary"
            rightIcon={<ChevronDown className="h-4 w-4 shrink-0" />}
            className="w-full whitespace-nowrap sm:w-auto"
          >
            Export Laporan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CardStats
          topIcon={<Receipt className="text-gray-300" />}
          label="TOTAL OMSET BULAN"
          subLabel="+14.8% vs bulan lalu"
          value={184500000}
        />
        <CardStats
          topIcon={<CheckCircle2 className="text-yellow-400" />}
          label="TRANSAKSI BERHASIL"
          subLabel="Paid (98.2%)"
          value={312}
        />
        <CardStats
          topIcon={<Hourglass className="text-blue-400" />}
          label="MENUNGGU PEMBAYARAN"
          subLabel="Pending Gateway"
          value={6}
        />
        <CardStats
          topIcon={<XCircle className="text-red-400" />}
          label="GAGAL / KEDALUWARSA"
          subLabel="Fail Rate <3%"
          value={3}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-white/5 bg-[#1C1F26] p-5 shadow-lg">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:flex-1">
            <Input
              type="text"
              placeholder="Cari Order ID, nama member, atau Midtrans ID..."
              className="placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
              <Search className="text-text-muted h-4 w-4" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative w-full sm:w-40 lg:w-48">
              <Select className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none">
                <option value="">Semua Jenis</option>
                <option value="membership">Membership</option>
                <option value="pt">PT Booking</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <ChevronDown className="text-text-muted h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-40 lg:w-48">
              <Select className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-white/10 bg-[#0B0C10] py-2.5 pr-10 pl-4 text-[13px] text-white transition-all focus:ring-1 focus:outline-none">
                <option value="">Semua Status</option>
                <option value="success">Berhasil</option>
                <option value="pending">Menunggu</option>
                <option value="failed">Gagal</option>
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <ChevronDown className="text-text-muted h-4 w-4" />
              </div>
            </div>

            <div className="relative w-full sm:w-48 lg:w-56">
              <Button
                variant="outline"
                className="text-text-muted w-full justify-start rounded-xl border-white/10 bg-[#0B0C10] px-4 py-2.5 text-[13px] hover:bg-white/5 hover:text-white"
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                1 Okt - 25 Okt 2024
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableTR isHeader={true}>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MEMBER</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">TIPE TRANSAKSI</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">NOMINAL</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">MIDTRANS ORDER ID</div>
              </TableTH>
              <TableTH>
                <div className="text-text-muted text-left text-[11px] font-bold tracking-wider uppercase">METODE BAYAR</div>
              </TableTH>
            </TableTR>
          </TableHead>
          <TableBody>
            {MOCK_TRANSACTION.map((trx, index) => (
              <TableTR
                key={trx.id}
                isEven={index % 2 === 0}
              >
                <TableTD>
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(trx.memberName, trx.profileUrl)}
                      alt={trx.memberName}
                      className="h-9 w-9 rounded-full border border-white/10 object-cover shadow-sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-white">{trx.memberName}</span>
                      <span className="text-text-muted text-[12px] font-medium tracking-wide">{trx.memberEmail}</span>
                    </div>
                  </div>
                </TableTD>

                <TableTD>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${trx.typeColor}`} />
                    <span className={`text-[13px] font-medium ${trx.type === "PT Booking (Single)" ? "text-text-muted" : "text-white"}`}>
                      {trx.type}
                    </span>
                  </div>
                </TableTD>

                <TableTD>
                  <span className={`text-[14px] font-bold ${trx.type === "PT Booking (Single)" ? "text-text-muted" : "text-white"}`}>
                    {formatRupiah(trx.nominal)}
                  </span>
                </TableTD>

                <TableTD>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-[13px]">{trx.orderId}</span>
                    <button
                      className="text-text-muted transition-colors hover:text-white"
                      title="Copy Order ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableTD>

                <TableTD>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted rounded bg-white/5 px-2 py-1 text-[11px] font-bold tracking-wider uppercase">
                      {trx.paymentMethod}
                    </span>
                    <span className="text-text-muted text-[12px]">{trx.paymentDesc}</span>
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
