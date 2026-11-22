import { useState } from "react"
import { Clock, Users, CheckCircle2, XCircle, ScanLine, QrCode, Loader2, LogOut, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

import { Card } from "~/components/ui/Card"
import { Button } from "~/components/ui/Button"
import { PageSkeleton } from "~/components/ui/PageSkeleton"
import Avatar from "~/components/ui/Avatar"
import LocalDate from "~/components/ui/LocalDate"
import { Table, TableHead, TableTR, TableTH, TableBody, TableTD } from "~/components/ui/table"
import LiveTokenGenerator from "~/components/attendance/LiveTokenGenerator"
import { Alert } from "~/utils/alert"
import { useCheckOutMemberMutation, useGetCheckinSummaryQuery, useGetRecentCheckinsQuery } from "~/services/checkin"

const CHECKIN_LIMIT = 5
const POLLING_OPTIONS = {
  pollingInterval: 30000,
  skipPollingIfUnfocused: true
}

export default function TerminalKehadiran() {
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null)

  const { data: summaryRes, isLoading: isLoadingSummary, refetch: refetchSummary } = useGetCheckinSummaryQuery(undefined, POLLING_OPTIONS)

  const {
    data: checkinsRes,
    isLoading: isLoadingCheckins,
    isFetching: isFetchingCheckins,
    isError,
    refetch: refetchCheckins
  } = useGetRecentCheckinsQuery(CHECKIN_LIMIT, POLLING_OPTIONS)

  const [checkOutMember] = useCheckOutMemberMutation()

  const summary = summaryRes?.data
  const checkins = checkinsRes?.data ?? []
  const latestValidations = checkins.slice(0, 2)

  const handleRefreshAll = () => {
    refetchSummary()
    refetchCheckins()
  }

  const handleCheckOut = async (memberId: string, memberName: string) => {
    const result = await Alert.confirm({
      title: "Check-out Member?",
      text: `Konfirmasi check-out untuk member "${memberName}" dari area gym?`,
      confirmText: "Ya, Check-out"
    })

    if (!result.isConfirmed) return

    setCheckingOutId(memberId)
    try {
      const res = await checkOutMember(memberId).unwrap()
      toast.success(res?.message || `${memberName} berhasil check-out!`)
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string }
      toast.error(apiErr?.data?.message || apiErr?.message || "Gagal melakukan check-out member.")
    } finally {
      setCheckingOutId(null)
    }
  }

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
            Terminal pemantauan akses masuk dan keluar member secara real-time menggunakan validasi QR dinamis.
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

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-4">
          <LiveTokenGenerator />
        </div>

        <div className="flex min-w-0 flex-col gap-5 xl:col-span-8 xl:gap-6">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ScanLine className="text-text-muted h-4 w-4 shrink-0" />
                <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">HASIL VALIDASI TERAKHIR</span>
              </div>

              <div className="flex items-center gap-2.5">
                {isFetchingCheckins && (
                  <span className="text-text-muted hidden items-center gap-1.5 text-[11px] sm:inline-flex">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Sinkronisasi...
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleRefreshAll}
                  disabled={isFetchingCheckins}
                  className="text-text-muted inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw className={`h-3 w-3 ${isFetchingCheckins ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {!latestValidations.length ? (
              <Card className="flex min-h-28 items-center justify-center p-4 text-center">
                <span className="text-text-muted text-[13px]">Belum ada aktivitas check-in terbaru.</span>
              </Card>
            ) : (
              latestValidations.map((item) => {
                const isDenied = item.status === "DENIED"
                const isOnFloor = !isDenied && !item.checkOutAt

                return (
                  <Card
                    key={item.id}
                    className={`flex flex-col justify-between gap-3.5 p-4 shadow-sm sm:flex-row sm:items-center sm:gap-4 ${
                      isDenied ? "border-red-900/30" : ""
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                      <div className="relative shrink-0">
                        <Avatar
                          name={item.memberName}
                          className={`h-12 w-12 rounded-full border-2 sm:h-13 sm:w-13 ${
                            isDenied ? "border-[#E58383] grayscale" : isOnFloor ? "border-[#D4B34A]" : "border-white/20"
                          }`}
                        />
                        <div
                          className={`absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                            isDenied ? "bg-[#E58383] text-white" : isOnFloor ? "bg-[#D4B34A] text-black" : "bg-emerald-500 text-black"
                          }`}
                        >
                          {isDenied ? (
                            <XCircle className="h-3.5 w-3.5" />
                          ) : isOnFloor ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <LogOut className="h-3 w-3" />
                          )}
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="truncate text-[15px] font-bold text-white sm:text-[16px]">{item.memberName}</h4>
                          <span className="text-text-muted shrink-0 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">
                            #{item.memberId.slice(0, 8)}
                          </span>
                        </div>

                        {isDenied ? (
                          <p className="line-clamp-2 text-[12px] leading-snug text-[#EAA1A1]">
                            Alasan: {item.denialReason || "Akses ditolak oleh sistem."}
                          </p>
                        ) : (
                          <div className="text-text-muted flex flex-col gap-0.5 text-[12px] xl:flex-row xl:items-center xl:gap-2">
                            <span
                              className={`whitespace-nowrap ${
                                isOnFloor ? "font-semibold text-[#D4B34A]" : "font-semibold text-emerald-400"
                              }`}
                            >
                              {isOnFloor ? "Sedang Berlatih" : "Sudah Check-out"}
                            </span>
                            {item.membershipExpiresAt && (
                              <>
                                <span className="hidden xl:inline">•</span>
                                <span className="whitespace-nowrap">
                                  Exp:{" "}
                                  <LocalDate
                                    date={item.membershipExpiresAt}
                                    variant="short"
                                  />
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row items-center justify-between gap-2 border-t border-white/5 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap uppercase ${
                          isDenied
                            ? "border border-[#E58383]/50 bg-[#3B1D20] text-[#E58383]"
                            : isOnFloor
                              ? "bg-[#D4B34A] text-black shadow-lg shadow-[#D4B34A]/20"
                              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {isDenied ? (
                          <XCircle className="h-3.5 w-3.5 shrink-0" />
                        ) : isOnFloor ? (
                          <ScanLine className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <LogOut className="h-3.5 w-3.5 shrink-0" />
                        )}
                        {isDenied ? "ACCESS DENIED" : isOnFloor ? "ON FLOOR" : "CHECKED OUT"}
                      </div>

                      <div
                        className={`flex items-center gap-2 font-mono text-[11px] whitespace-nowrap ${
                          isDenied ? "text-[#EAA1A1]/70" : "text-text-muted"
                        }`}
                      >
                        <span>
                          In:{" "}
                          <LocalDate
                            date={item.checkInAt}
                            variant="hour"
                          />
                        </span>
                        {item.checkOutAt && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400/90">
                              Out:{" "}
                              <LocalDate
                                date={item.checkOutAt}
                                variant="hour"
                              />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>

          <Card className="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[16px] font-bold text-white sm:text-[17px]">Live Gate Validation Stream</h3>
              <p className="text-text-muted text-[12px] sm:text-[13px]">
                Menampilkan {CHECKIN_LIMIT} transaksi otentikasi gerbang teranyar secara real-time
              </p>
            </div>

            {isError ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-red-400">Gagal memuat riwayat check-in.</p>
                <Button
                  variant="secondary"
                  onClick={refetchCheckins}
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
                      <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">METODE</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">STATUS</div>
                    </TableTH>
                    <TableTH>
                      <div className="text-left text-[11px] font-bold tracking-wider text-[#A28F79] uppercase">CATATAN / KELUAR</div>
                    </TableTH>
                  </TableTR>
                </TableHead>
                <TableBody>
                  {!checkins.length ? (
                    <TableTR>
                      <TableTD colSpan={5}>
                        <div className="text-text-muted flex min-h-48 items-center justify-center text-sm">Belum ada riwayat check-in.</div>
                      </TableTD>
                    </TableTR>
                  ) : (
                    checkins.map((stream, index) => {
                      const isDenied = stream.status === "DENIED"
                      const isOnFloor = !isDenied && !stream.checkOutAt
                      const isProcessing = checkingOutId === stream.memberId

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
                            <div className="flex items-center gap-2.5">
                              <Avatar
                                name={stream.memberName}
                                className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9"
                              />
                              <span
                                className={`truncate text-[13px] font-bold sm:text-[14px] ${isDenied ? "text-[#EAA1A1]" : "text-white"}`}
                              >
                                {stream.memberName}
                              </span>
                            </div>
                          </TableTD>

                          <TableTD>
                            <div className="text-text-muted flex items-center gap-1.5 whitespace-nowrap">
                              <QrCode className="h-4 w-4 shrink-0" />
                              <span className="text-[13px]">{stream.method}</span>
                            </div>
                          </TableTD>

                          <TableTD>
                            <div
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider whitespace-nowrap uppercase ${
                                isDenied
                                  ? "bg-[#3B1D20] text-[#E58383]"
                                  : isOnFloor
                                    ? "bg-[#332A15] text-[#D4B34A]"
                                    : "bg-emerald-500/15 text-emerald-400"
                              }`}
                            >
                              <div
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                  isDenied ? "bg-[#E58383]" : isOnFloor ? "bg-[#D4B34A]" : "bg-emerald-400"
                                }`}
                              />
                              {isDenied ? "DENIED" : isOnFloor ? "ON FLOOR" : "SELESAI"}
                            </div>
                          </TableTD>

                          <TableTD>
                            {isDenied ? (
                              <span className="text-[13px] text-[#EAA1A1]">{stream.denialReason || "Akses ditolak"}</span>
                            ) : stream.checkOutAt ? (
                              <span className="text-text-muted font-mono text-[12px] whitespace-nowrap">
                                Keluar:{" "}
                                <LocalDate
                                  date={stream.checkOutAt}
                                  variant="hour"
                                />
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleCheckOut(stream.memberId, stream.memberName)}
                                disabled={isProcessing}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-white transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                                Check-out
                              </button>
                            )}
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
