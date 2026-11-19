import { Clock, RefreshCw, ScanLine, Smartphone } from "lucide-react"
import { Card } from "~/components/ui/Card"

export default function LiveTokenGenerator() {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary/85" />
          <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">LIVE TOKEN GENERATOR</span>
        </div>
      </div>

      <div className="relative mx-auto mt-2 flex aspect-square w-full max-w-70 items-center justify-center rounded-2xl bg-white p-4">
        <div className="absolute top-0 left-0 h-8 w-8 rounded-tl-2xl border-t-4 border-l-4 border-primary/85" />
        <div className="absolute top-0 right-0 h-8 w-8 rounded-tr-2xl border-t-4 border-r-4 border-primary/85" />
        <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-primary/85" />
        <div className="absolute right-0 bottom-0 h-8 w-8 rounded-br-2xl border-r-4 border-b-4 border-primary/85" />

        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SmartGymGateSecureToken"
          alt="QR Code"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="text-text-muted flex items-center justify-between text-[12px] font-medium">
          <span className="flex items-center gap-1.5 text-primary">
            <Clock className="h-3.5 w-3.5" /> Token valid: 23s
          </span>
          <span>Anti-Screenshot</span>
        </div>
        <p className="text-text-muted text-[12px] leading-relaxed">
          Dynamic cipher prevents screenshot sharing. The scanner syncs every 30 seconds automatically.
        </p>
        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/10">
          <RefreshCw className="h-4 w-4" />
          Refresh Token Sekarang
        </button>
      </div>

      <div className="mt-6 border-t border-white/5 pt-5">
        <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">PANDUAN AKSES MEMBER</span>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Card className="p-3 bg-primary">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-white border-b border-white pb-2">
                <Smartphone className="h-4 w-4 text-white" /> Langkah 1 & 2
              </span>
              <span className="text-white text-[12px]">Buka aplikasi SmartGym, lalu ketuk menu Scan Gate.</span>
            </div>
          </Card>
          <Card className="p-3 bg-primary">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-white border-b border-white pb-2">
                <ScanLine className="h-4 w-4 text-white" /> Langkah 3
              </span>
              <span className="text-white text-[12px]">Arahkan kamera ke layar QR ini.</span>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  )
}
