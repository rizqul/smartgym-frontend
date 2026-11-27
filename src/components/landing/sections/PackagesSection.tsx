import { useState } from "react"
import { CalendarDays, Check, RefreshCw, Store } from "lucide-react"

import { useGetLandingMembershipPackagesQuery } from "~/services/landing.service"
import type { MembershipPackage, MembershipPackagesData } from "~/types/membership.type"
import { formatRupiah } from "~/utils/format"

type TierKey = "WEEKLY" | "MONTHLY" | "YEARLY"

interface TierConfig {
  key: TierKey
  title: string
  badge: string
  badgeClass: string
  period: string
  isPopular?: boolean
  defaultFeatures: string[]
}

const REGISTER_CTA = {
  label: "Register at Receptionist",
  href: "#alur-pendaftaran"
} as const

const TIER_CONFIGS: TierConfig[] = [
  {
    key: "WEEKLY",
    title: "Weekly",
    badge: "Weekly Pass",
    badgeClass: "bg-card text-text-secondary",
    period: "/ week",
    defaultFeatures: ["Full Gym Equipment Access", "Daily Locker & Hot Shower", "SmartGym Member App Check-In"]
  },
  {
    key: "MONTHLY",
    title: "Monthly",
    badge: "Best Value",
    badgeClass: "bg-primary/15 text-primary",
    period: "/ month",
    isPopular: true,
    defaultFeatures: ["Unlimited Gym Facility Access", "Personal Trainer Booking Access", "SmartGym Member App & QR Check-In"]
  },
  {
    key: "YEARLY",
    title: "Yearly",
    badge: "All-In",
    badgeClass: "bg-secondary/15 text-secondary",
    period: "/ year",
    defaultFeatures: ["Maximum Annual Savings", "Full All-Year Gym Access", "Priority Member Support"]
  }
]

const FACILITIES_MARKER_REGEX = /^(facilities|fasilitas|features|benefits|includes)\s*:\s*(.*)$/i

function getPackagesByTier(data: MembershipPackagesData | undefined, tierKey: TierKey): MembershipPackage[] {
  if (!data) return []

  const matchedKey = Object.keys(data).find((key) => key.toUpperCase() === tierKey)
  const list = matchedKey ? data[matchedKey] : []

  return [...(list ?? [])].sort((a, b) => a.price - b.price)
}

function cleanFeatureLine(line: string): string {
  return line.replace(/^[-•*]\s*/, "").trim()
}

function parsePackageDescription(
  pkg: MembershipPackage,
  fallbackFeatures: string[]
): {
  summary: string
  facilitiesLabel: string
  features: string[]
} {
  const rawDescription = pkg.description?.trim() ?? ""

  if (!rawDescription) {
    return {
      summary: "Flexible gym membership plan for your training routine.",
      facilitiesLabel: "Facilities",
      features: fallbackFeatures
    }
  }

  const rawLines = rawDescription
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const markerIndex = rawLines.findIndex((line) => FACILITIES_MARKER_REGEX.test(line))

  if (markerIndex !== -1) {
    const markerMatch = rawLines[markerIndex].match(FACILITIES_MARKER_REGEX)
    const labelText = markerMatch?.[1] ?? "Facilities"
    const inlineItems = markerMatch?.[2]?.trim() ?? ""

    const summary = rawLines.slice(0, markerIndex).join(" ")

    const extractedFeatures = [
      ...(inlineItems ? inlineItems.split(";") : []),
      ...rawLines.slice(markerIndex + 1).flatMap((line) => line.split(";"))
    ]
      .map(cleanFeatureLine)
      .filter((item) => item && !item.endsWith(":"))

    return {
      summary,
      facilitiesLabel: labelText.charAt(0).toUpperCase() + labelText.slice(1).toLowerCase(),
      features: extractedFeatures.length > 0 ? extractedFeatures : fallbackFeatures
    }
  }

  const fallbackLines = rawDescription
    .split(/\r?\n|;/)
    .map(cleanFeatureLine)
    .filter((item) => item && !item.endsWith(":"))

  if (fallbackLines.length > 1) {
    return {
      summary: fallbackLines[0],
      facilitiesLabel: "Facilities",
      features: fallbackLines.slice(1)
    }
  }

  return {
    summary: rawDescription,
    facilitiesLabel: "Facilities",
    features: fallbackFeatures
  }
}

export default function PackagesSection() {
  const { data: res, isLoading, isError, refetch } = useGetLandingMembershipPackagesQuery()
  const [selectedIndexByTier, setSelectedIndexByTier] = useState<Record<TierKey, number>>({
    WEEKLY: 0,
    MONTHLY: 0,
    YEARLY: 0
  })

  const packagesMap = res?.data

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

        {isLoading ? (
          <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="bg-surface/75 border-border/60 flex h-110 animate-pulse flex-col rounded-2xl border p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-card h-6 w-32 rounded-lg" />
                  <div className="bg-card h-6 w-20 rounded-md" />
                </div>
                <div className="bg-card mt-3 h-4 w-4/5 rounded" />
                <div className="bg-card mt-8 h-10 w-44 rounded-lg" />
                <div className="mt-8 flex flex-1 flex-col gap-3">
                  <div className="bg-card h-4 w-full rounded" />
                  <div className="bg-card h-4 w-5/6 rounded" />
                  <div className="bg-card h-4 w-2/3 rounded" />
                </div>
                <div className="bg-card mt-8 h-11 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-surface/75 border-border/60 mt-14 flex flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-14 text-center">
            <p className="text-text-secondary text-sm">Failed to load membership plans right now.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-card hover:bg-border border-border/60 text-text-primary inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
            {TIER_CONFIGS.map((tier) => {
              const tierPackages = getPackagesByTier(packagesMap, tier.key)
              const selectedIdx = Math.min(selectedIndexByTier[tier.key] ?? 0, Math.max(tierPackages.length - 1, 0))
              const activePkg = tierPackages[selectedIdx]
              const isPopular = Boolean(tier.isPopular)

              if (!activePkg) {
                return (
                  <div
                    key={tier.key}
                    className={`relative flex flex-col rounded-2xl border p-6 transition-all sm:p-7 ${
                      isPopular
                        ? "bg-surface border-primary/40 shadow-[0_0_45px_rgba(255,107,0,0.14)] lg:-translate-y-2"
                        : "bg-surface/75 border-border/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-text-primary text-xl font-bold">{tier.title}</h3>
                      <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${tier.badgeClass}`}>
                        {tier.badge}
                      </span>
                    </div>

                    <div className="text-text-muted flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center text-xs">
                      <CalendarDays className="h-7 w-7 opacity-40" />
                      <span>No {tier.title.toLowerCase()} packages available yet.</span>
                    </div>
                  </div>
                )
              }

              const { summary, facilitiesLabel, features } = parsePackageDescription(activePkg, tier.defaultFeatures)

              return (
                <div
                  key={tier.key}
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
                    <h3 className="text-text-primary text-xl font-bold">{activePkg.name}</h3>
                    <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${tier.badgeClass}`}>
                      {tier.badge}
                    </span>
                  </div>

                  {tierPackages.length > 1 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tierPackages.map((pkgOption, optionIndex) => {
                        const isSelected = optionIndex === selectedIdx
                        return (
                          <button
                            key={pkgOption.id}
                            type="button"
                            onClick={() =>
                              setSelectedIndexByTier((prev) => ({
                                ...prev,
                                [tier.key]: optionIndex
                              }))
                            }
                            className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              isSelected
                                ? "bg-primary/20 text-primary border-primary/30 border"
                                : "bg-card text-text-muted hover:text-text-primary border border-transparent"
                            }`}
                          >
                            {pkgOption.name}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {summary && <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-[13px]">{summary}</p>}

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-text-muted text-xs font-semibold">Rp</span>
                    <span
                      className={`text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl ${
                        isPopular ? "text-primary" : "text-text-primary"
                      }`}
                    >
                      {formatRupiah(activePkg.price)}
                    </span>
                    <span className="text-text-muted text-xs font-medium">{tier.period}</span>
                  </div>

                  {activePkg.duration > 0 && (
                    <div className="text-text-secondary mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-semibold">
                      <CalendarDays className="text-primary h-3.5 w-3.5 shrink-0" />
                      <span>Valid for {activePkg.duration} days</span>
                    </div>
                  )}

                  <div className="border-border/50 mt-5 flex flex-1 flex-col border-t pt-5">
                    <span className="text-text-muted text-[11px] font-bold tracking-wider uppercase">{facilitiesLabel}</span>

                    <ul className="mt-3 flex flex-1 flex-col gap-3">
                      {features.map((feature, featureIndex) => (
                        <li
                          key={`${feature}-${featureIndex}`}
                          className="text-text-secondary flex items-start gap-2.5 text-xs sm:text-[13.5px]"
                        >
                          <Check className="text-success mt-0.5 h-4 w-4 shrink-0 stroke-[2.5]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={REGISTER_CTA.href}
                    className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-colors sm:text-sm ${
                      isPopular
                        ? "bg-primary hover:bg-primary-hover text-background shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                        : "bg-card hover:bg-border border-border/60 text-text-primary border"
                    }`}
                  >
                    <Store className="h-4 w-4 shrink-0" />
                    <span>{REGISTER_CTA.label}</span>
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
