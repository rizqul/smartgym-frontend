import { ArrowRight, BadgeCheck, Dumbbell, Info, QrCode, ShieldCheck, UserPlus, Zap } from "lucide-react"

const HERO_HIGHLIGHTS = [
  {
    icon: QrCode,
    iconColor: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
    title: "Seamless Access",
    subtitle: "Automated Smart QR Gate"
  },
  {
    icon: Dumbbell,
    iconColor: "text-info",
    iconBg: "bg-info/10 border-info/20",
    title: "100+ Equipment Units",
    subtitle: "Commercial Grade & Biomechanical"
  },
  {
    icon: BadgeCheck,
    iconColor: "text-secondary",
    iconBg: "bg-secondary/10 border-secondary/20",
    title: "Personal Trainers",
    subtitle: "Internationally Certified"
  }
]

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden py-16 sm:py-24 lg:py-28"
    >
      <div className="bg-primary/15 pointer-events-none absolute top-0 left-1/2 h-105 w-145 -translate-x-1/2 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="bg-surface/80 border-border/70 text-text-secondary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase">
            <Zap className="text-primary h-3.5 w-3.5 fill-current" />
            SMART FITNESS MEETS NEXT-GEN TECHNOLOGY
          </span>

          <h1 className="text-text-primary mt-6 max-w-3xl text-3xl leading-[1.12] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Transform Your Body &amp; Lifestyle at Indonesia&apos;s <span className="text-primary">Smart</span> Gym
          </h1>

          <p className="text-text-secondary mt-6 max-w-2xl text-sm leading-relaxed sm:text-base">
            Enjoy hassle-free entry with Smart QR Terminals, world-class biomechanical equipment, and internationally certified trainers.
            Take precise control of your workouts through the SmartGym app.
          </p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <a
              href="#fitur"
              className="bg-primary hover:bg-primary-hover text-text-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-[0_0_24px_rgba(255,107,0,0.3)] transition-colors sm:w-auto"
            >
              <Info className="h-4 w-4" />
              About Us
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#alur-pendaftaran"
              className="bg-surface border-border hover:bg-card text-text-primary inline-flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-colors sm:w-auto"
            >
              <UserPlus className="text-primary h-4 w-4" />
              Registration Flow
            </a>
          </div>

          <div className="bg-surface/70 border-border/60 mt-6 flex max-w-2xl items-start gap-3 rounded-xl border px-4 py-3 text-left sm:items-center">
            <ShieldCheck className="text-text-muted mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
            <p className="text-text-muted text-xs leading-relaxed">
              Official account registration &amp; email verification are handled directly by SmartGym staff at the Receptionist. Full access
              is then unlocked via the SmartGym Mobile App.
            </p>
          </div>

          <div className="bg-surface/80 border-border/60 mt-10 grid w-full grid-cols-1 gap-3 rounded-2xl border p-3 text-left sm:grid-cols-3 lg:mt-12 lg:p-4">
            {HERO_HIGHLIGHTS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-background/50 border-border/40 flex items-center gap-3.5 rounded-xl border px-4 py-3.5"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${item.iconBg}`}>
                    <Icon className={`h-4.5 w-4.5 ${item.iconColor}`} />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-text-primary truncate text-xs font-bold sm:text-sm">{item.title}</span>
                    <span className="text-text-muted truncate text-[11px] sm:text-xs">{item.subtitle}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
