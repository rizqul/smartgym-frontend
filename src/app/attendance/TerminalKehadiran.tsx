import { Clock, Users, CheckCircle2, XCircle, ScanLine, QrCode } from "lucide-react"

import { Card } from "~/components/ui/Card"
import Table from "~/components/ui/Table"
import TableHead from "~/components/ui/TableHead"
import TableTR from "~/components/ui/TableTR"
import TableTH from "~/components/ui/TableTH"
import TableBody from "~/components/ui/TableBody"
import TableTD from "~/components/ui/TableTD"
import { mockGateStreams } from "~/data/mockGateStreams"
import LiveTokenGenerator from "~/components/ui/LiveTokenGenerator"

export default function TerminalKehadiran() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Terminal Kehadiran & QR Station</h2>
          <p className="text-text-muted max-w-2xl text-[14px]">
            Dedicated high-cadence access monitoring terminal with real-time biometric and dynamic cryptographic QR validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-evenly gap-3 text-[13px]">
          <div className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-orange-500">
            <ScanLine className="h-4 w-4" />
            <span className="font-bold">Live QR Station</span>
            <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-black uppercase">Active</span>
          </div>

          <div className="text-text-muted flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <Clock className="h-4 w-4" />
            <span>
              Riwayat Kehadiran <strong className="text-white">1,428</strong>
            </span>
          </div>

          <div className="text-text-muted flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <Users className="h-4 w-4" />
            <span>On-Floor</span>
            <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[11px] font-bold text-yellow-500">84 / 120</span>
          </div>

          <div className="text-text-muted flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <span>Check-ins Hari Ini</span>
            <strong className="text-lg text-white">318</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <LiveTokenGenerator />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanLine className="text-text-muted h-4 w-4" />
                <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">HASIL VALIDASI TERAKHIR</span>
              </div>
              <span className="text-text-muted font-mono text-[11px]">09:42:25 WIB</span>
            </div>

            <Card className="flex items-center justify-between p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Budi"
                    className="h-14 w-14 rounded-full border-2 border-[#D4B34A] object-cover"
                  />
                  <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4B34A] text-black">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-bold text-white">Budi Santoso</h4>
                    <span className="text-text-muted rounded bg-white/10 px-1.5 py-0.5 text-[10px]">#SG-0812</span>
                  </div>
                  <div className="text-text-muted flex items-center gap-2 text-[12px]">
                    <span className="font-bold text-[#D4B34A]">Annual Pro Unlimited</span>
                    <span>•</span>
                    <span>Exp: 12 Des 2025</span>
                    <span>•</span>
                    <span>Gate 1</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 rounded-lg bg-[#D4B34A] px-3 py-1.5 text-[12px] font-bold text-black uppercase shadow-lg shadow-[#D4B34A]/20">
                  <ScanLine className="h-4 w-4" /> ACCESS GRANTED
                </div>
                <span className="text-text-muted font-mono text-[11px]">09:41:12 WIB</span>
              </div>
            </Card>

            <Card className="flex items-center justify-between border-red-900/30 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Kevin"
                    className="h-14 w-14 rounded-full border-2 border-[#E58383] object-cover grayscale"
                  />
                  <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E58383] text-white">
                    <XCircle className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[16px] font-bold text-white">Kevin Sanjaya</h4>
                    <span className="text-text-muted rounded bg-white/10 px-1.5 py-0.5 text-[10px]">#SG-0391</span>
                  </div>
                  <p className="max-w-md text-[12px] leading-snug text-[#EAA1A1]">
                    Alasan: Membership Kadaluarsa (3 hari lalu). Arahkan member ke meja kasir untuk perpanjangan paket bulanan.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5 rounded-lg border border-[#E58383]/50 bg-[#3B1D20] px-3 py-1.5 text-[12px] font-bold text-[#E58383] uppercase">
                  <XCircle className="h-4 w-4" /> ACCESS DENIED
                </div>
                <span className="font-mono text-[11px] text-[#EAA1A1]/70">09:38:04 WIB</span>
              </div>
            </Card>
          </div>

          <Card className="flex flex-col gap-4 p-5">
            <div className="flex flex-col">
              <h3 className="text-[17px] font-bold text-white">Live Gate Validation Stream</h3>
              <p className="text-text-muted text-[13px]">Menampilkan 6 transaksi otentikasi gerbang teranyar secara real-time</p>
            </div>

            <Table>
              <TableHead>
                <TableTR isHeader={true}>
                  <TableTH>
                    <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">WAKTU</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">MEMBER</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">PAKET</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">METODE</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">STATUS</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">CATATAN / DETAIL</div>
                  </TableTH>
                  <TableTH>
                    <div className="text-right text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">GATE ID</div>
                  </TableTH>
                </TableTR>
              </TableHead>
              <TableBody>
                {mockGateStreams.map((stream, index) => {
                  const isDenied = stream.status === "DENIED"
                  return (
                    <TableTR
                      key={stream.id}
                      className={isDenied ? "bg-red-950/30" : index % 2 === 0 ? "bg-transparent" : "bg-white/5"}
                    >
                      <TableTD>
                        <span className="text-text-muted font-mono text-[13px]">{stream.time}</span>
                      </TableTD>
                      <TableTD>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${stream.initialsColor}`}
                          >
                            {stream.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-[14px] font-bold ${isDenied ? "text-[#EAA1A1]" : "text-white"}`}>
                              {stream.memberName}
                            </span>
                            <span className="text-text-muted text-[11px] tracking-wide">{stream.memberId}</span>
                          </div>
                        </div>
                      </TableTD>
                      <TableTD>
                        <span className="text-text-muted text-[13px]">{stream.package}</span>
                      </TableTD>
                      <TableTD>
                        <div className="text-text-muted flex items-center gap-1.5">
                          <QrCode className="h-4 w-4" />
                          <span className="text-[13px]">{stream.method}</span>
                        </div>
                      </TableTD>
                      <TableTD>
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${isDenied ? "bg-[#3B1D20] text-[#E58383]" : "bg-[#332A15] text-[#D4B34A]"}`}
                        >
                          <div className={`h-1.5 w-1.5 rounded-full ${isDenied ? "bg-[#E58383]" : "bg-[#D4B34A]"}`} />
                          {stream.status}
                        </div>
                      </TableTD>
                      <TableTD>
                        <span className={`text-[13px] ${isDenied ? "text-[#EAA1A1]" : "text-text-muted"}`}>{stream.notes}</span>
                      </TableTD>
                      <TableTD>
                        <div className="text-right">
                          <span className="text-text-muted font-mono text-[12px]">{stream.gateId}</span>
                        </div>
                      </TableTD>
                    </TableTR>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}
