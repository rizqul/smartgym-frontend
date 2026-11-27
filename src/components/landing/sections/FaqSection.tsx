import { useState } from "react"
import {
  CalendarCheck,
  ChevronDown,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
  type LucideIcon
} from "lucide-react"

interface FaqItem {
  id: number
  question: string
  answer: string
  note?: string
  tag: string
  icon: LucideIcon
  iconWrapClass: string
  iconClass: string
  tagClass: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 0,
    question: "How do I register as a new SmartGym member?",
    answer:
      "Registration is done directly at our club Receptionist. Our admin staff will assist with identity verification, membership activation, your first gym entry, and setting up your SmartGym Mobile App account.",
    note: "Served at Club Reception",
    tag: "Receptionist",
    icon: Store,
    iconWrapClass: "bg-primary/10 border-primary/20",
    iconClass: "text-primary",
    tagClass: "bg-primary/10 text-primary"
  },
  {
    id: 1,
    question: "Why is account registration handled by staff instead of online self-registration?",
    answer:
      "To maintain facility security and prevent account misuse, every member completes a one-time in-person identity verification at the Receptionist so your dynamic QR access is officially tied to your verified account.",
    tag: "Security",
    icon: ShieldCheck,
    iconWrapClass: "bg-secondary/10 border-secondary/20",
    iconClass: "text-secondary",
    tagClass: "bg-secondary/10 text-secondary"
  },
  {
    id: 2,
    question: "How does the AI Trainer feature work?",
    answer:
      "Available directly in the SmartGym Mobile App, AI Trainer generates personalized workout routines and adaptive training recommendations based on your fitness goals, experience level, and weekly progress.",
    tag: "AI Trainer",
    icon: Sparkles,
    iconWrapClass: "bg-info/10 border-info/20",
    iconClass: "text-info",
    tagClass: "bg-info/10 text-info"
  },
  {
    id: 3,
    question: "Can Personal Trainer (PT) sessions be booked through the mobile app?",
    answer:
      "Yes. Once your account is active, you can browse available coach profiles, check real-time slot availability, and instantly lock in 1-on-1 private training sessions from the app.",
    tag: "Trainer",
    icon: CalendarCheck,
    iconWrapClass: "bg-primary/10 border-primary/20",
    iconClass: "text-primary",
    tagClass: "bg-primary/10 text-primary"
  },
  {
    id: 4,
    question: "What payment methods are accepted?",
    answer: "We accept QRIS, major bank Virtual Accounts, e-wallet, and QRIS payments for membership renewals and PT bookings.",
    tag: "Payment",
    icon: Wallet,
    iconWrapClass: "bg-secondary/10 border-secondary/20",
    iconClass: "text-secondary",
    tagClass: "bg-secondary/10 text-secondary"
  },
  {
    id: 5,
    question: "How do I check my membership status and renew it?",
    answer:
      "You can monitor your active membership period and expiration date anytime in the SmartGym Mobile App. When it is time to renew, simply choose your preferred package and pay directly through the app or at the Receptionist.",
    tag: "Membership",
    icon: RefreshCw,
    iconWrapClass: "bg-info/10 border-info/20",
    iconClass: "text-info",
    tagClass: "bg-info/10 text-info"
  }
]

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(0)

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="bg-surface border-border/70 text-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(255,107,0,0.15)]">
            <HelpCircle className="h-3.5 w-3.5" />
            OFFICIAL SMARTGYM FAQ
          </span>

          <h2 className="text-text-primary mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="text-text-secondary mt-3 text-sm leading-relaxed">
            Everything you need to know about our operations, account registration, and the SmartGym mobile app.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3.5">
          {FAQ_ITEMS.map((item) => {
            const Icon = item.icon
            const isOpen = openId === item.id

            return (
              <div
                key={item.id}
                className={`bg-surface/80 overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-border" : "border-border/50 hover:border-border/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.iconWrapClass}`}>
                      <Icon className={`h-4 w-4 ${item.iconClass}`} />
                    </div>
                    <span className="text-text-primary text-sm font-bold sm:text-[15px]">{item.question}</span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`hidden rounded-md px-2.5 py-1 text-[11px] font-semibold sm:inline-flex ${item.tagClass}`}>
                      {item.tag}
                    </span>
                    <ChevronDown
                      className={`text-text-muted h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "text-text-primary rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-border/40 border-t px-5 pt-4 pb-5 sm:px-6">
                    <p className="text-text-secondary text-xs leading-relaxed sm:text-[13.5px]">{item.answer}</p>

                    {item.note && (
                      <div className="text-text-muted mt-3.5 inline-flex items-center gap-1.5 text-[11.5px] font-medium">
                        <Store className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.note}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
