import { Check, Headset, Store, type LucideIcon } from "lucide-react"

export interface MembershipPackage {
  id?: string
  name: string
  badge: string
  badgeClass?: string
  desc: string
  price: string
  period: string
  features: string[]
  ctaLabel?: string
  ctaIcon?: LucideIcon
  ctaHref?: string
}

const DEFAULT_MEMBERSHIP_PACKAGES: MembershipPackage[] = [
  {
    name: "Basic",
    badge: "Off-Peak",
    badgeClass: "bg-card text-text-secondary",
    desc: "Ideal for quiet daytime training sessions.",
    price: "350.000",
    period: "/ mo",
    features: ["Access 09:00 – 16:00 WIB", "1 Registered Gym Branch", "Daily Locker & Hot Shower"],
    ctaLabel: "Register at Receptionist",
    ctaIcon: Store,
    ctaHref: "#alur-pendaftaran"
  },
  {
    name: "All-Access Pro",
    badge: "24/7",
    badgeClass: "bg-primary/15 text-primary",
    desc: "Unlimited access to all gym facilities.",
    price: "550.000",
    period: "/ mo",
    features: ["24/7 Access at All Branches", "2x Personal Trainer Sessions", "Monthly InBody Scan", "Sauna & Recovery Zone"],
    ctaLabel: "Register at Receptionist",
    ctaIcon: Store,
    ctaHref: "#alur-pendaftaran"
  },
  {
    name: "VIP Elite",
    badge: "All-In",
    badgeClass: "bg-secondary/15 text-secondary",
    desc: "Private facilities & maximum comfort.",
    price: "950.000",
    period: "/ mo",
    features: ["All All-Access Pro Benefits", "VIP Athletes Lounge Access", "Free Daily Workout Laundry", "Priority Parking Reservation"],
    ctaLabel: "Consult VIP Plan",
    ctaIcon: Headset,
    ctaHref: "#kontak"
  }
]

interface PackagesSectionProps {
  packages?: MembershipPackage[]
}

export default function PackagesSection({ packages = DEFAULT_MEMBERSHIP_PACKAGES }: PackagesSectionProps) {
  const visiblePackages = packages.slice(0, 3)

  return (
    <section
      id="paket"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="text-primary text-xs font-extrabold tracking-[0.2em] uppercase">MEMBERSHIP</span>

          <h2 className="text-text-primary mt-2 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">Membership Plans</h2>

          <p className="text-text-secondary mt-3 text-sm leading-relaxed">
            Choose your favorite plan. Registration &amp; payment are processed directly by our staff at the Receptionist, followed by
            automatic activation via the SmartGym Member App.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {visiblePackages.map((pkg, index) => {
            const CtaIcon = pkg.ctaIcon ?? Store
            const isPopular = visiblePackages.length === 3 && index === 1
            const badgeClass = pkg.badgeClass ?? (isPopular ? "bg-primary/15 text-primary" : "bg-card text-text-secondary")

            return (
              <div
                key={pkg.id ?? pkg.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all sm:p-7 ${
                  isPopular
                    ? "bg-surface border-primary/40 shadow-[0_0_45px_rgba(255,107,0,0.14)] lg:-translate-y-2"
                    : "bg-surface/75 border-border/60 hover:border-border"
                }`}
              >
                {isPopular && (
                  <span className="bg-primary text-background absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-extrabold tracking-wider uppercase shadow-[0_0_16px_rgba(255,107,0,0.45)]">
                    POPULAR
                  </span>
                )}

                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-text-primary text-xl font-bold">{pkg.name}</h3>
                  <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${badgeClass}`}>{pkg.badge}</span>
                </div>

                <p className="text-text-muted mt-1.5 text-xs sm:text-[13px]">{pkg.desc}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-text-muted text-xs font-semibold">Rp</span>
                  <span
                    className={`text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl ${
                      isPopular ? "text-primary" : "text-text-primary"
                    }`}
                  >
                    {pkg.price}
                  </span>
                  <span className="text-text-muted text-xs font-medium">{pkg.period}</span>
                </div>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-text-secondary flex items-center gap-2.5 text-xs sm:text-[13.5px]"
                    >
                      <Check className="text-success h-4 w-4 shrink-0 stroke-[2.5]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={pkg.ctaHref ?? "#alur-pendaftaran"}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-colors sm:text-sm ${
                    isPopular
                      ? "bg-primary hover:bg-primary-hover text-background shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                      : "bg-card hover:bg-border border-border/60 text-text-primary border"
                  }`}
                >
                  <CtaIcon className="h-4 w-4 shrink-0" />
                  <span>{pkg.ctaLabel ?? "Register at Receptionist"}</span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
