import { Calendar } from "lucide-react"

export default function TrainerScheduleTab() {
  return (
    <div className="flex min-h-105 flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#1C1F26] p-8 text-center">
      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
        <Calendar className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-white">Kalender &amp; Live Jadwal Sesi PT</h3>
      <p className="text-text-muted max-w-md text-sm">
        Pantau jadwal sesi personal training harian, slot tersedia, dan status kehadiran trainer secara real-time di sini.
      </p>
    </div>
  )
}
