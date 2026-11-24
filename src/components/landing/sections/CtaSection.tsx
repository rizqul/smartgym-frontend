import { CheckCircle2, MessageSquareText, Store } from "lucide-react"

const CTA_PERKS = ["Staff-Assisted Account Activation", "Smart QR Gate Access via Mobile App", "Flexible Payment Options"]

export default function CtaSection() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="bg-surface/85 border-border/60 relative rounded-3xl border px-6 pt-12 pb-10 text-center shadow-2xl sm:px-12 sm:pt-14 sm:pb-12">
          <span className="bg-primary text-background absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold tracking-wider whitespace-nowrap uppercase shadow-[0_0_24px_rgba(255,107,0,0.45)]">
            <Store className="h-3.5 w-3.5 shrink-0" />
            ON-SITE REGISTRATION &amp; CONSULTATION
          </span>

          <div className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full blur-3xl" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <span className="bg-background/70 border-border/60 text-text-secondary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
              <Store className="text-secondary h-3.5 w-3.5 shrink-0" />
              Direct registration handled at our Front Desk
            </span>

            <h2 className="text-text-primary mt-6 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-[42px]">
              Ready to Start? Visit Our Gym or{" "}
              <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-transparent">Consult with Our Staff</span>
            </h2>

            <p className="text-text-secondary mt-4 max-w-xl text-sm leading-relaxed">
              Meet our reception team for instant account activation. Once registered at the front desk, you can immediately access the QR
              gate and book training sessions through the SmartGym Mobile App.
            </p>

            <a
              href="https://wa.me/6281200000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-hover text-background mt-8 inline-flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-extrabold shadow-[0_0_28px_rgba(255,107,0,0.4)] transition-colors"
            >
              <MessageSquareText className="h-4 w-4 shrink-0" />
              <span>Chat with Front Desk via WhatsApp</span>
            </a>
          </div>

          <div className="border-border/50 mt-10 border-t pt-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs font-medium">
              {CTA_PERKS.map((perk) => (
                <li
                  key={perk}
                  className="text-text-secondary inline-flex items-center gap-2"
                >
                  <CheckCircle2 className="text-success h-4 w-4 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
