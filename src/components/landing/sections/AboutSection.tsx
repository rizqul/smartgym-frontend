import { Calendar, CheckCircle2, QrCode, RefreshCw, ShieldCheck, SlidersHorizontal, TrendingUp, Zap } from "lucide-react"

const ABOUT_STATS = [
  {
    value: "2.500",
    suffix: "+",
    valueClass: "text-primary",
    suffixClass: "text-primary text-lg font-bold",
    label: "Member Aktif",
    desc: "Komunitas latihan konsisten & suportif"
  },
  {
    value: "99.8",
    suffix: "%",
    valueClass: "text-secondary",
    suffixClass: "text-secondary text-lg font-bold",
    label: "Gate & App Uptime",
    desc: "Tanpa hambatan sistem masuk gym"
  },
  {
    value: "18",
    suffix: "Coach",
    valueClass: "text-info",
    suffixClass: "text-info text-sm font-bold italic",
    label: "Pelatih Bersertifikasi",
    desc: "Standar NASM, CSCS, & ACE"
  },
  {
    value: "06.00 - 21.00",
    suffix: null,
    valueClass: "text-text-primary text-2xl sm:text-[26px]",
    suffixClass: "",
    label: "OPEN",
    labelClass: "text-primary text-[11px] font-extrabold tracking-wider uppercase",
    desc: "Buka 365 hari termasuk hari libur"
  }
]

const ADVANTAGES = [
  {
    icon: QrCode,
    footerIcon: ShieldCheck,
    accentText: "text-primary",
    accentBg: "bg-primary/10 border-primary/20",
    footerBg: "bg-primary/10 text-primary",
    title: "Akses Otomatis QR 24/7",
    desc: "Scan kode dinamis dari smartphone di turnstile gerbang tanpa antre resepsionis dan tanpa kartu fisik yang mudah hilang.",
    footerLabel: "Teknologi Anti-Sharing"
  },
  {
    icon: Calendar,
    footerIcon: RefreshCw,
    accentText: "text-secondary",
    accentBg: "bg-secondary/10 border-secondary/20",
    footerBg: "bg-secondary/10 text-secondary",
    title: "Booking Sesi Trainer Instan",
    desc: "Pilih coach bersertifikasi, cek kalender latihan realtime, dan kunci jadwal latihan privat 1-on-1 langsung dari aplikasi.",
    footerLabel: "Sinkronisasi Google Calendar"
  },
  {
    icon: SlidersHorizontal,
    footerIcon: CheckCircle2,
    accentText: "text-info",
    accentBg: "bg-info/10 border-info/20",
    footerBg: "bg-info/10 text-info",
    title: "Alat Biomekanik Terbaik",
    desc: "Rangkaian beban komersial premium dari Life Fitness, Rogue, & Eleiko dengan kalibrasi rutin untuk mencegah cedera sendi.",
    footerLabel: "Maintenance Terjadwal"
  },
  {
    icon: TrendingUp,
    footerIcon: TrendingUp,
    accentText: "text-primary",
    accentBg: "bg-primary/10 border-primary/20",
    footerBg: "bg-primary/10 text-primary",
    title: "InBody & Smart Tracking",
    desc: "Pantau persentase lemak tubuh, massa otot murni, dan status metabolisme berkala yang terhubung otomatis ke dashboard member.",
    footerLabel: "Grafik Evaluasi Bulanan"
  }
]

export default function AboutSection() {
  return (
    <section
      id="fitur"
      className="relative py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface/80 border-border/50 flex flex-col justify-between rounded-2xl border p-5"
            >
              <div className="flex items-baseline gap-1.5">
                <span className={`text-3xl font-extrabold tracking-tight ${stat.valueClass}`}>{stat.value}</span>
                {stat.suffix && <span className={stat.suffixClass}>{stat.suffix}</span>}
              </div>

              <div className="mt-2 flex flex-col gap-0.5">
                <span className={stat.labelClass ?? "text-text-primary text-xs font-bold"}>{stat.label}</span>
                <span className="text-text-muted text-[11.5px] leading-snug">{stat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-border/40 my-14 border-t sm:my-16" />

        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="bg-surface border-border/70 text-text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase">
            <Zap className="text-primary h-3.5 w-3.5 fill-current" />
            EVOLUSI KEBUGARAN MODERN
          </span>

          <h2 className="text-text-primary mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            Mengapa SmartGym Berbeda Dari Gym Tradisional?
          </h2>

          <p className="text-text-secondary mt-3.5 text-sm leading-relaxed">
            Kami memangkas birokrasi pendaftaran usang dan menggantinya dengan ekosistem digital otomatis, higienis, serta alat presisi
            tinggi untuk hasil terukur.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((item) => {
            const Icon = item.icon
            const FooterIcon = item.footerIcon

            return (
              <div
                key={item.title}
                className="bg-surface/80 border-border/60 hover:border-border flex h-full flex-col rounded-2xl border p-6 transition-colors"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${item.accentBg}`}>
                  <Icon className={`h-5 w-5 ${item.accentText}`} />
                </div>

                <h3 className="text-text-primary mt-5 text-base font-bold">{item.title}</h3>
                <p className="text-text-muted mt-2.5 flex-1 text-xs leading-relaxed sm:text-[13px]">{item.desc}</p>

                <div className="border-border/50 mt-6 flex items-center justify-between gap-2 border-t pt-4">
                  <span className={`text-[11.5px] font-semibold ${item.accentText}`}>{item.footerLabel}</span>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.footerBg}`}>
                    <FooterIcon className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
