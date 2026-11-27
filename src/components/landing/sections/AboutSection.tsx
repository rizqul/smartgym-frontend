import { Calendar, CheckCircle2, QrCode, RefreshCw, ShieldCheck, SlidersHorizontal, TrendingUp, Zap } from "lucide-react"

const ABOUT_STATS = [
  {
    value: "2,500",
    suffix: "+",
    valueClass: "text-primary text-2xl sm:text-3xl",
    suffixClass: "text-primary text-base sm:text-lg font-bold",
    label: "Active Members",
    desc: "Consistent & supportive community"
  },
  {
    value: "99.8",
    suffix: "%",
    valueClass: "text-secondary text-2xl sm:text-3xl",
    suffixClass: "text-secondary text-base sm:text-lg font-bold",
    label: "Gate & App Uptime",
    desc: "Seamless, uninterrupted gym entry"
  },
  {
    value: "18",
    suffix: "Coaches",
    valueClass: "text-info text-2xl sm:text-3xl",
    suffixClass: "text-info text-xs sm:text-sm font-bold italic",
    label: "Certified Trainers",
    desc: "NASM, CSCS, & ACE standards"
  },
  {
    value: "06:00 – 21:00",
    suffix: null,
    valueClass: "text-text-primary text-lg sm:text-2xl whitespace-nowrap",
    suffixClass: "",
    label: "OPEN DAILY",
    labelClass: "text-primary text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase",
    desc: "Open daily except public holidays"
  }
]

const ADVANTAGES = [
  {
    icon: QrCode,
    footerIcon: ShieldCheck,
    accentText: "text-primary",
    accentBg: "bg-primary/10 border-primary/20",
    footerBg: "bg-primary/10 text-primary",
    title: "Automated Access",
    desc: "Scan dynamic QR codes directly from your smartphone for instant, contactless gate entry.",
    footerLabel: "Anti-Sharing Technology"
  },
  {
    icon: Calendar,
    footerIcon: RefreshCw,
    accentText: "text-secondary",
    accentBg: "bg-secondary/10 border-secondary/20",
    footerBg: "bg-secondary/10 text-secondary",
    title: "Instant Trainer Booking",
    desc: "Choose certified coaches, check real-time schedules, and lock in 1-on-1 private sessions directly from the app.",
    footerLabel: "Real-Time Slot Availability"
  },
  {
    icon: SlidersHorizontal,
    footerIcon: CheckCircle2,
    accentText: "text-info",
    accentBg: "bg-info/10 border-info/20",
    footerBg: "bg-info/10 text-info",
    title: "Premium Equipment",
    desc: "Commercial-grade strength and cardio machines, routinely calibrated to maximize results and prevent joint injury.",
    footerLabel: "Scheduled Maintenance"
  },
  {
    icon: TrendingUp,
    footerIcon: TrendingUp,
    accentText: "text-primary",
    accentBg: "bg-primary/10 border-primary/20",
    footerBg: "bg-primary/10 text-primary",
    title: "AI Trainer",
    desc: "Get personalized workout recommendations and adaptive training plans tailored to your body goals and progress.",
    footerLabel: "Personalized Workout Plans"
  }
]

export default function AboutSection() {
  return (
    <section
      id="fitur"
      className="relative mt-2 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ABOUT_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface/80 border-border/50 flex flex-col justify-between rounded-2xl border p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-baseline gap-1">
                <span className={`font-extrabold tracking-tight tabular-nums ${stat.valueClass}`}>{stat.value}</span>
                {stat.suffix && <span className={stat.suffixClass}>{stat.suffix}</span>}
              </div>

              <div className="mt-2.5 flex flex-col gap-0.5">
                <span className={stat.labelClass ?? "text-text-primary text-xs font-bold"}>{stat.label}</span>
                <span className="text-text-muted text-[11px] leading-snug sm:text-[11.5px]">{stat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-border/40 my-14 border-t sm:my-16" />

        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="bg-surface border-border/70 text-text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase">
            <Zap className="text-primary h-3.5 w-3.5 fill-current" />
            MODERN FITNESS EVOLUTION
          </span>

          <h2 className="text-text-primary mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">Why Choose SmartGym?</h2>

          <p className="text-text-secondary mt-3.5 text-sm leading-relaxed">
            We eliminate outdated registration bureaucracy and replace it with a seamless digital fitness ecosystem.
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
