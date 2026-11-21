import { Clock, Users, CheckCircle2, XCircle, ScanLine, QrCode, Loader2 } from "lucide-react"

import { Card } from "~/components/ui/Card"
import { Button } from "~/components/ui/Button"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import Avatar from "~/components/ui/Avatar"
import LocalDate from "~/components/ui/LocalDate"
import { Table, TableHead, TableTR, TableTH, TableBody, TableTD } from "~/components/ui/table"
import LiveTokenGenerator from "~/components/attendance/LiveTokenGenerator"
import { useGetCheckinSummaryQuery, useGetRecentCheckinsQuery } from "~/services/checkin"

const CHECKIN_LIMIT = 5
const POLLING_OPTIONS = {
  pollingInterval: 10000,
  skipPollingIfUnfocused: true
}

export default function TerminalKehadiran() {
  const { data: summaryRes, isLoading: isLoadingSummary } = useGetCheckinSummaryQuery(undefined, POLLING_OPTIONS)

  const {
    data: checkinsRes,
    isLoading: isLoadingCheckins,
    isFetching: isFetchingCheckins,
    isError,
    refetch
  } = useGetRecentCheckinsQuery(CHECKIN_LIMIT, POLLING_OPTIONS)

  const summary = summaryRes?.data
  const checkins = checkinsRes?.data ?? []
  const latestValidations = checkins.slice(0, 2)

  if (isLoadingSummary && isLoadingCheckins) {
    return (
      <div className="w-full p-4 lg:p-6">
        <PageSkeleton
          statCount={0}
          contentVariant="list"
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold text-white">Terminal Kehadiran & QR Station</h2>
          <p className="text-text-muted max-w-2xl text-[14px]">
            Dedicated high-cadence access monitoring terminal with real-time biometric and dynamic cryptographic QR validation.
          </p>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-4 xl:grid-cols-4 xl:gap-0 xl:divide-x xl:divide-white/10">
            <div className="flex items-center gap-2.5 sm:gap-3 xl:pr-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-500 sm:h-10 sm:w-10">
                <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-text-muted text-[10px] font-medium uppercase sm:text-[11px] sm:whitespace-nowrap">
                  Status Terminal
                </span>
                <span className="truncate text-[13px] font-bold text-white sm:text-[14px]">Live QR Station</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 xl:px-5">
              <div className="text-text-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-10 sm:w-10">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-text-muted text-[10px] font-medium uppercase sm:text-[11px] sm:whitespace-nowrap">
                  Riwayat Kehadiran
                </span>
                <strong className="text-base leading-tight text-white sm:text-lg">
                  {(summary?.historyCount ?? 0).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 xl:px-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-500 sm:h-10 sm:w-10">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-text-muted text-[10px] font-medium uppercase sm:text-[11px] sm:whitespace-nowrap">
                  Sedang Berlatih
                </span>
                <div className="flex items-baseline gap-1.5">
                  <strong className="text-base leading-tight text-yellow-400 sm:text-lg">
                    {(summary?.onFloor ?? 0).toLocaleString("id-ID")}
                  </strong>
                  <span className="text-text-muted text-[10px] sm:text-[11px]">member</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 xl:pl-5">
              <div className="bg-primary/10 border-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border sm:h-10 sm:w-10">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-text-muted text-[10px] font-medium uppercase sm:text-[11px] sm:whitespace-nowrap">
                  Riwayat Hari Ini
                </span>
                <strong className="text-base leading-tight text-white sm:text-lg">
                  {(summary?.checkinsToday ?? 0).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          </div>
        </Card>
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
              {isFetchingCheckins && (
                <span className="text-text-muted inline-flex items-center gap-1.5 text-[11px]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Sinkronisasi...
                </span>
              )}
            </div>

            {!latestValidations.length ? (
              <Card className="flex min-h-28 items-center justify-center p-4 text-center">
                <span className="text-text-muted text-[13px]">Belum ada aktivitas check-in terbaru.</span>
              </Card>
            ) : (
              latestValidations.map((item) => {
                const isDenied = item.status === "DENIED"

                return (
                  <Card
                    key={item.id}
                    className={`flex flex-col justify-between gap-4 p-4 shadow-sm sm:flex-row sm:items-center ${
                      isDenied ? "border-red-900/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar
                          name={item.memberName}
                          className={`h-14 w-14 rounded-full border-2 ${isDenied ? "border-[#E58383] grayscale" : "border-[#D4B34A]"}`}
                        />
                        <div
                          className={`absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full ${
                            isDenied ? "bg-[#E58383] text-white" : "bg-[#D4B34A] text-black"
                          }`}
                        >
                          {isDenied ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[16px] font-bold text-white">{item.memberName}</h4>
                          <span className="text-text-muted rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
                            #{item.memberId.slice(0, 8)}
                          </span>
                        </div>

                        {isDenied ? (
                          <p className="max-w-md text-[12px] leading-snug text-[#EAA1A1]">
                            Alasan: {item.denialReason || "Akses ditolak oleh sistem."}
                          </p>
                        ) : (
                          <div className="text-text-muted flex flex-wrap items-center gap-2 text-[12px]">
                            <span className="font-bold text-[#D4B34A]">{item.membershipName}</span>
                            <span>•</span>
                            <span>
                              Exp: <LocalDate date={item.membershipExpiresAt} />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1 sm:items-end">
                      <div
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold uppercase ${
                          isDenied
                            ? "border border-[#E58383]/50 bg-[#3B1D20] text-[#E58383]"
                            : "bg-[#D4B34A] text-black shadow-lg shadow-[#D4B34A]/20"
                        }`}
                      >
                        {isDenied ? <XCircle className="h-4 w-4" /> : <ScanLine className="h-4 w-4" />}
                        {isDenied ? "ACCESS DENIED" : "ACCESS GRANTED"}
                      </div>
                      <span className={`font-mono text-[11px] ${isDenied ? "text-[#EAA1A1]/70" : "text-text-muted"}`}>
                        <LocalDate
                          date={item.checkInAt}
                          variant="hour"
                        />
                      </span>
                    </div>
                  </Card>
                )
              })
            )}
          </div>

          <Card className="flex flex-col gap-4 p-5">
            <div className="flex flex-col">
              <h3 className="text-[17px] font-bold text-white">Live Gate Validation Stream</h3>
              <p className="text-text-muted text-[13px]">
                Menampilkan {CHECKIN_LIMIT} transaksi otentikasi gerbang teranyar secara real-time
              </p>
            </div>

            {isError ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-400">Gagal memuat riwayat check-in.</p>
                <Button
                  variant="secondary"
                  onClick={refetch}
                >
                  Coba Lagi
                </Button>
              </div>
            ) : (
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
                  </TableTR>
                </TableHead>
                <TableBody>
                  {!checkins.length ? (
                    <TableTR>
                      <TableTD colSpan={6}>
                        <div className="text-text-muted flex min-h-48 items-center justify-center text-sm">Belum ada riwayat check-in.</div>
                      </TableTD>
                    </TableTR>
                  ) : (
                    checkins.map((stream, index) => {
                      const isDenied = stream.status === "DENIED"
                      return (
                        <TableTR
                          key={stream.id}
                          className={isDenied ? "bg-red-950/30" : index % 2 === 0 ? "bg-transparent" : "bg-white/5"}
                        >
                          <TableTD>
                            <span className="text-text-muted font-mono text-[13px] whitespace-nowrap">
                              <LocalDate
                                date={stream.checkInAt}
                                variant="hour"
                              />
                            </span>
                          </TableTD>
                          <TableTD>
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={stream.memberName}
                                className="h-9 w-9 rounded-full"
                              />
                              <span className={`text-[14px] font-bold ${isDenied ? "text-[#EAA1A1]" : "text-white"}`}>
                                {stream.memberName}
                              </span>
                            </div>
                          </TableTD>
                          <TableTD>
                            <span className="text-text-muted text-[13px]">{stream.membershipName || "-"}</span>
                          </TableTD>
                          <TableTD>
                            <div className="text-text-muted flex items-center gap-1.5">
                              <QrCode className="h-4 w-4" />
                              <span className="text-[13px]">{stream.method}</span>
                            </div>
                          </TableTD>
                          <TableTD>
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${
                                isDenied ? "bg-[#3B1D20] text-[#E58383]" : "bg-[#332A15] text-[#D4B34A]"
                              }`}
                            >
                              <div className={`h-1.5 w-1.5 rounded-full ${isDenied ? "bg-[#E58383]" : "bg-[#D4B34A]"}`} />
                              {stream.status}
                            </div>
                          </TableTD>
                          <TableTD>
                            <span className={`text-[13px] ${isDenied ? "text-[#EAA1A1]" : "text-text-muted"}`}>
                              {isDenied ? stream.denialReason || "Akses ditolak" : "Check-in berhasil"}
                            </span>
                          </TableTD>
                        </TableTR>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
