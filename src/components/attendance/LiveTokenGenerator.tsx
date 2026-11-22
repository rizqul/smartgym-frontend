import { useCallback, useEffect, useState } from "react"
import { Clock, HelpCircle, Loader2, RefreshCw, ScanLine, Smartphone } from "lucide-react"
import toast from "react-hot-toast"

import { Card } from "~/components/ui/Card"
import { useGenerateQrTokenMutation } from "~/services/checkin"
import type { CheckinToken } from "~/types/checkin"

const FE_QR_LIFETIME_SECONDS = 10 * 60
const QR_STORAGE_KEY = "smartgym_checkin_qr_token"

interface StoredQrToken {
  tokenData: CheckinToken
  feExpiresAt: number
}

const formatCountdown = (totalSeconds: number) => {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const loadStoredQr = (): StoredQrToken | null => {
  try {
    const raw = localStorage.getItem(QR_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredQrToken
    if (!parsed?.tokenData?.token || !parsed?.feExpiresAt) return null
    return parsed
  } catch {
    return null
  }
}

function MemberAccessGuide() {
  return (
    <>
      <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">PANDUAN AKSES MEMBER</span>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-primary flex flex-col gap-1.5 rounded-xl p-3">
          <span className="flex items-center gap-1.5 border-b border-white/40 pb-1.5 text-[12px] font-bold text-white">
            <Smartphone className="h-4 w-4 shrink-0 text-white" /> Langkah 1 & 2
          </span>
          <span className="text-[12px] leading-snug text-white">Buka aplikasi SmartGym, lalu masuk menu Scan Gate.</span>
        </div>
        <div className="bg-primary flex flex-col gap-1.5 rounded-xl p-3">
          <span className="flex items-center gap-1.5 border-b border-white/40 pb-1.5 text-[12px] font-bold text-white">
            <ScanLine className="h-4 w-4 shrink-0 text-white" /> Langkah 3
          </span>
          <span className="text-[12px] leading-snug text-white">Arahkan kamera ke layar QR ini.</span>
        </div>
      </div>
    </>
  )
}

export default function LiveTokenGenerator() {
  const [stored] = useState<StoredQrToken | null>(() => loadStoredQr())
  const [tokenData, setTokenData] = useState<CheckinToken | null>(stored?.tokenData ?? null)
  const [feExpiresAt, setFeExpiresAt] = useState<number | null>(stored?.feExpiresAt ?? null)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() =>
    stored ? Math.max(0, Math.floor((stored.feExpiresAt - Date.now()) / 1000)) : 0
  )

  const [generateQrToken, { isLoading }] = useGenerateQrTokenMutation()

  const handleGenerate = useCallback(
    async (showToast = false) => {
      try {
        const res = await generateQrToken().unwrap()
        if (res.data) {
          const beExpiresAtMs = new Date(res.data.expiresAt).getTime()
          const targetExpiresAtMs = Math.min(Date.now() + FE_QR_LIFETIME_SECONDS * 1000, beExpiresAtMs)

          const payload: StoredQrToken = {
            tokenData: res.data,
            feExpiresAt: targetExpiresAtMs
          }

          localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(payload))
          setTokenData(res.data)
          setFeExpiresAt(targetExpiresAtMs)
          setRemainingSeconds(Math.max(0, Math.floor((targetExpiresAtMs - Date.now()) / 1000)))

          if (showToast) {
            toast.success(res.message || "QR token berhasil diperbarui!")
          }
        }
      } catch (err: unknown) {
        const apiErr = err as { data?: { message?: string }; message?: string }
        toast.error(apiErr?.data?.message || apiErr?.message || "Gagal membuat QR token.")
      }
    },
    [generateQrToken]
  )

  useEffect(() => {
    if (!stored) {
      handleGenerate(false)
    }
  }, [stored, handleGenerate])

  useEffect(() => {
    if (!feExpiresAt) return

    const interval = setInterval(() => {
      const diff = Math.floor((feExpiresAt - Date.now()) / 1000)
      if (diff <= 0) {
        setRemainingSeconds(0)
        clearInterval(interval)
      } else {
        setRemainingSeconds(diff)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [feExpiresAt])

  const isExpired = Boolean(tokenData) && remainingSeconds <= 0
  const qrUrl = tokenData?.token
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(tokenData.token)}`
    : ""

  return (
    <Card className="relative flex flex-col gap-5 overflow-visible p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isExpired ? "bg-red-500" : "bg-primary/85 animate-pulse"}`} />
          <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">LIVE TOKEN GENERATOR</span>
        </div>

        <div className="group relative hidden xl:block">
          <button
            type="button"
            aria-label="Panduan Akses Member"
            className="text-text-muted hover:border-primary/40 hover:bg-primary/10 hover:text-primary flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <div className="pointer-events-none invisible absolute top-0 left-full z-50 ml-8 w-80 translate-x-1 rounded-2xl border border-white/10 bg-[#1C1F26] p-4 opacity-0 shadow-2xl transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
            <MemberAccessGuide />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center xl:flex-col xl:items-stretch">
        <div className="relative mx-auto flex aspect-square w-full max-w-60 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 md:mx-0 md:w-56 xl:mx-auto xl:w-full xl:max-w-64">
          <div className="border-primary/85 absolute top-0 left-0 z-10 h-8 w-8 rounded-tl-2xl border-t-4 border-l-4" />
          <div className="border-primary/85 absolute top-0 right-0 z-10 h-8 w-8 rounded-tr-2xl border-t-4 border-r-4" />
          <div className="border-primary/85 absolute bottom-0 left-0 z-10 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4" />
          <div className="border-primary/85 absolute right-0 bottom-0 z-10 h-8 w-8 rounded-br-2xl border-r-4 border-b-4" />

          {isLoading || !qrUrl ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-xs font-medium">Membuat QR...</span>
            </div>
          ) : (
            <>
              <img
                src={qrUrl}
                alt="QR Code Check-in"
                className={`h-full w-full object-contain transition-all duration-300 ${
                  isExpired ? "pointer-events-none scale-95 opacity-35 blur-md select-none" : ""
                }`}
              />

              {isExpired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 p-4 text-center backdrop-blur-[2px]">
                  <span className="text-sm font-bold text-white">QR Kedaluwarsa</span>
                  <span className="text-[11px] text-white/80">Klik tombol refresh untuk membuat QR baru.</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex w-full flex-1 flex-col gap-3">
          <div className="text-text-muted flex items-center text-[12px] font-medium">
            <span className={`flex items-center gap-1.5 font-mono ${isExpired ? "text-red-400" : "text-primary"}`}>
              <Clock className="h-3.5 w-3.5" />
              {isExpired ? "Token kedaluwarsa" : `Token valid: ${formatCountdown(remainingSeconds)}`}
            </span>
          </div>
          <p className="text-text-muted text-[12px] leading-relaxed">
            Tampilan QR aktif selama 10 menit. Setelah waktu habis, QR akan diburamkan hingga diperbarui kembali.
          </p>
          <button
            type="button"
            onClick={() => handleGenerate(true)}
            disabled={isLoading}
            className={`mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isExpired ? "bg-primary hover:bg-primary/90" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Memperbarui Token..." : "Refresh Token Sekarang"}
          </button>

          <div className="mt-2 border-t border-white/5 pt-4 xl:hidden">
            <MemberAccessGuide />
          </div>
        </div>
      </div>
    </Card>
  )
}
