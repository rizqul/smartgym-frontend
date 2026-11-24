import { useState } from "react"
import { Download, ExternalLink, Info, KeyRound, Play, Smartphone, UserCheck } from "lucide-react"

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.smartgym.app"
const GOOGLE_PLAY_QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(GOOGLE_PLAY_URL)}`

const REGISTRATION_STEPS = [
  {
    step: 1,
    badge: "At the Gym Receptionist",
    title: "Visit the SmartGym Receptionist",
    desc: "Drop by our flagship club. Our reception and admin team will guide your registration, help you choose a membership plan, and verify your official ID.",
    footerIcon: Info,
    footerLabel: "Onboarding & Front-Desk Payment",
    stepBg: "bg-primary text-background shadow-[0_0_20px_rgba(255,107,0,0.45)]",
    badgeClass: "bg-card/80 text-text-secondary",
    footerClass: "text-primary"
  },
  {
    step: 2,
    badge: "Instant Account Activation",
    title: "Receive Your Account Credentials",
    desc: "Our staff immediately registers your profile in the SmartGym internal portal. You will receive an official activation link and member ID via email.",
    footerIcon: KeyRound,
    footerLabel: "System-Verified Member ID",
    stepBg: "bg-secondary text-background shadow-[0_0_20px_rgba(255,209,102,0.4)]",
    badgeClass: "bg-card/80 text-secondary",
    footerClass: "text-secondary"
  },
  {
    step: 3,
    badge: "Member Mobile App",
    title: "Download the SmartGym Mobile App",
    desc: "Log in to the member app to generate your dynamic QR gate pass, book personal trainer sessions, and get personalized workout plans from our AI Trainer.",
    footerIcon: Smartphone,
    footerLabel: "Gate Access & Booking in Your Pocket",
    stepBg: "bg-info text-background shadow-[0_0_20px_rgba(56,189,248,0.4)]",
    badgeClass: "bg-card/80 text-info",
    footerClass: "text-info"
  }
]

export default function RegistrationFlowSection() {
  const [showQr, setShowQr] = useState(false)

  return (
    <section
      id="alur-pendaftaran"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="bg-surface border-border/70 text-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(255,107,0,0.15)]">
            <UserCheck className="h-3.5 w-3.5" />
            MEMBER REGISTRATION FLOW
          </span>

          <h2 className="text-text-primary mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            3 Simple Steps to Start Training
          </h2>

          <p className="text-text-secondary mt-3.5 text-sm leading-relaxed">
            No confusing online sign-up forms. Secure verification is handled directly by our staff, followed by full control through the
            mobile app.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {REGISTRATION_STEPS.map((item) => {
            const FooterIcon = item.footerIcon

            return (
              <div
                key={item.step}
                className="bg-surface/80 border-border/60 hover:border-border flex h-full flex-col rounded-2xl border p-6 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-extrabold ${item.stepBg}`}
                  >
                    {item.step}
                  </div>

                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-text-primary mt-6 text-lg font-bold">{item.title}</h3>
                <p className="text-text-muted mt-2.5 flex-1 text-xs leading-relaxed sm:text-[13px]">{item.desc}</p>

                <div className="border-border/50 mt-6 flex items-center gap-2 border-t pt-4">
                  <FooterIcon className={`h-4 w-4 shrink-0 ${item.footerClass}`} />
                  <span className={`text-xs font-semibold ${item.footerClass}`}>{item.footerLabel}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-surface/80 border-border/60 mt-6 overflow-hidden rounded-2xl border transition-all">
          <div className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/15 border-primary/25 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
                <Download className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-text-primary text-sm font-bold sm:text-base">Download SmartGym Mobile Member App</h4>
                <p className="text-text-muted text-xs sm:text-[13px]">Available on Google Play Store for all active SmartGym members.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQr((prev) => !prev)}
              aria-expanded={showQr}
              className="bg-background hover:bg-card border-border text-text-primary inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold transition-colors sm:w-auto"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{showQr ? "Hide QR Code" : "Google Play"}</span>
            </button>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              showQr ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-border/50 bg-background/40 flex flex-col items-center gap-5 border-t px-5 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
                <div className="shrink-0 rounded-2xl bg-white p-3 shadow-md">
                  <img
                    src={GOOGLE_PLAY_QR_SRC}
                    alt="SmartGym Google Play QR Code"
                    width={144}
                    height={144}
                    className="h-36 w-36 object-contain"
                  />
                </div>

                <div className="flex flex-col items-center gap-2 sm:items-start">
                  <span className="text-primary text-[11px] font-bold tracking-wider uppercase">Scan with Your Phone</span>
                  <h5 className="text-text-primary text-base font-bold">Install SmartGym on Android</h5>
                  <p className="text-text-muted max-w-md text-xs leading-relaxed sm:text-[13px]">
                    Point your smartphone camera at this QR code to open the SmartGym Mobile App directly on Google Play Store.
                  </p>
                  <a
                    href={GOOGLE_PLAY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary-hover text-text-primary mt-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Google Play Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
