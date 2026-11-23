import { ArrowRight, BadgeCheck, Dumbbell, Info, QrCode, Radio, ShieldCheck, UserPlus, Zap } from "lucide-react"

const HERO_HIGHLIGHTS = [
  {
    icon: QrCode,
    iconColor: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
    title: "Akses Mudah",
    subtitle: "Smart QR Gate Otomatis"
  },
  {
    icon: Dumbbell,
    iconColor: "text-info",
    iconBg: "bg-info/10 border-info/20",
    title: "100+ Unit Alat",
    subtitle: "Commercial Grade & Biom"
  },
  {
    icon: BadgeCheck,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10 border-secondary/20",
    title: "Personal Trainer",
    subtitle: "Sertifikasi Internasional"
  }
]

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24"
    >
      <div className="bg-primary/15 pointer-events-none absolute top-0 left-1/2 h-105 w-145 -translate-x-1/2 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="flex flex-col items-start">
            <span className="bg-surface/80 border-border/70 text-text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase">
              <Zap className="text-primary h-3.5 w-3.5 fill-current" />
              SMART FITNESS MEETS NEXT-GEN TECHNOLOGY
            </span>

            <h1 className="text-text-primary mt-6 text-3xl leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-[52px]">
              Transformasi Tubuh &amp; Gaya Hidup di Gym <span className="text-primary">Cerdas</span> di Indonesia
            </h1>

            <p className="text-text-secondary mt-5 max-w-xl text-sm leading-relaxed sm:text-[15px]">
              Akses tanpa ribet dengan Terminal QR, peralatan biomekanik berkaliber dunia, dan pelatih bersertifikasi internasional.
              Kendalikan latihan secara presisi lewat aplikasi cerdas SmartGym.
            </p>

            <div className="mt-7 flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <a
                href="#fitur"
                className="bg-primary hover:bg-primary-hover text-text-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-[0_0_24px_rgba(255,107,0,0.3)] transition-colors sm:flex-none"
              >
                <Info className="h-4 w-4" />
                Tentang Kami
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#paket"
                className="bg-surface border-border hover:bg-card text-text-primary inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors sm:flex-none"
              >
                <UserPlus className="text-primary h-4 w-4" />
                Alur Pendaftaran
              </a>
            </div>

            <div className="bg-surface/70 border-border/60 mt-5 flex max-w-xl items-start gap-3 rounded-xl border px-4 py-3">
              <ShieldCheck className="text-text-muted mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-text-muted text-xs leading-relaxed">
                Pendaftaran akun resmi &amp; verifikasi email diproses langsung oleh staf SmartGym di resepsionis. Akses penuh kemudian via
                SmartGym Mobile App.
              </p>
            </div>

            <div className="bg-surface/80 border-border/60 mt-8 grid w-full grid-cols-1 gap-3 rounded-2xl border p-3 sm:grid-cols-3">
              {HERO_HIGHLIGHTS.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="bg-background/50 border-border/40 flex items-center gap-3 rounded-xl border px-3.5 py-3"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.iconBg}`}>
                      <Icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-text-primary truncate text-xs font-bold sm:text-[13px]">{item.title}</span>
                      <span className="text-text-muted truncate text-[11px]">{item.subtitle}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <div className="bg-surface border-border/70 relative aspect-4/3 w-full overflow-hidden rounded-2xl border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                alt="Interior SmartGym"
                className="h-full w-full object-cover"
              />

              <div className="from-background/90 via-background/20 to-background/40 absolute inset-0 bg-linear-to-t" />

              <div className="bg-background/80 border-border/60 absolute top-4 left-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md">
                <span className="bg-success h-2 w-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-text-primary text-xs font-semibold">Kapasitas: 42% Nyaman</span>
              </div>

              <div className="bg-surface/85 border-border/70 absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-xl border p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/15 border-primary/30 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                    <Radio className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-muted text-[10px] font-bold tracking-wider uppercase">GATE STATUS</span>
                    <span className="text-text-primary text-xs font-bold sm:text-sm">Auto Turnstile Online</span>
                  </div>
                </div>

                <span className="bg-success/15 border-success/30 text-success shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-bold">
                  Scan QR Gate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
