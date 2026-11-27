import { useRef } from "react"
import { Award, ChevronLeft, ChevronRight, RefreshCw, Users } from "lucide-react"

import { useGetLandingTrainersQuery } from "~/services/landing.service"
import { getAvatarUrl } from "~/utils/avatar"
import { formatRupiah } from "~/utils/format"

const SPECIALIZATION_META: Record<string, { label: string; badgeClass: string }> = {
  GENERAL_FITNESS: { label: "General Fitness", badgeClass: "bg-primary/20 text-primary border-primary/30" },
  WEIGHT_LOSS: { label: "Weight Loss", badgeClass: "bg-secondary/20 text-secondary border-secondary/30" },
  BODYBUILDING: { label: "Bodybuilding", badgeClass: "bg-primary/20 text-primary border-primary/30" },
  STRENGTH_CONDITIONING: { label: "Strength & Conditioning", badgeClass: "bg-info/20 text-info border-info/30" },
  FUNCTIONAL_TRAINING: { label: "Functional Training", badgeClass: "bg-secondary/20 text-secondary border-secondary/30" },
  CARDIO_ENDURANCE: { label: "Cardio Endurance", badgeClass: "bg-info/20 text-info border-info/30" },
  MOBILITY_FLEXIBILITY: { label: "Mobility & Flexibility", badgeClass: "bg-secondary/20 text-secondary border-secondary/30" },
  CORRECTIVE_REHAB: { label: "Corrective & Rehab", badgeClass: "bg-info/20 text-info border-info/30" },
  SPORTS_PERFORMANCE: { label: "Sports Performance", badgeClass: "bg-primary/20 text-primary border-primary/30" }
}

function getSpecializationMeta(specialization: string) {
  const key = specialization?.toUpperCase()
  if (SPECIALIZATION_META[key]) return SPECIALIZATION_META[key]

  const formattedLabel = specialization
    ? specialization
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Personal Trainer"

  return {
    label: formattedLabel,
    badgeClass: "bg-primary/20 text-primary border-primary/30"
  }
}

export default function TrainersSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: res, isLoading, isError, refetch } = useGetLandingTrainersQuery()

  const trainers = res?.data ?? []

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = 320
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  return (
    <section
      id="trainer"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-xs font-extrabold tracking-[0.2em] uppercase">COACHING TEAM</span>
            <h2 className="text-text-primary text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
              Guided by Experienced Coaches
            </h2>
          </div>

          {trainers.length > 0 && (
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="bg-surface border-border hover:bg-card text-text-secondary hover:text-text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="bg-surface border-border hover:bg-card text-text-secondary hover:text-text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="mt-10 flex gap-5 overflow-hidden pb-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-surface/80 border-border/60 w-67.5 shrink-0 animate-pulse overflow-hidden rounded-2xl border sm:w-75"
              >
                <div className="bg-card aspect-4/3 w-full" />
                <div className="flex flex-col gap-2 p-4">
                  <div className="bg-card h-5 w-40 rounded" />
                  <div className="bg-card h-3.5 w-32 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-surface/75 border-border/60 mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-14 text-center">
            <p className="text-text-secondary text-sm">Failed to load coaching team data.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="bg-card hover:bg-border border-border/60 text-text-primary inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : !trainers.length ? (
          <div className="bg-surface/75 border-border/60 text-text-muted mt-10 flex flex-col items-center justify-center gap-2 rounded-2xl border px-6 py-14 text-center text-sm">
            <Users className="h-8 w-8 opacity-40" />
            <span>No personal trainers available at the moment.</span>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="custom-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
          >
            {trainers.map((trainer) => {
              const spec = getSpecializationMeta(trainer.specialization)
              const experienceYears = trainer.experience ?? 0
              const experienceLabel = `${experienceYears} ${experienceYears === 1 ? "Year" : "Years"} of Experience`

              return (
                <div
                  key={trainer.id}
                  className="bg-surface/80 border-border/60 hover:border-border group w-67.5 shrink-0 snap-start overflow-hidden rounded-2xl border transition-colors sm:w-75"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden">
                    <img
                      src={getAvatarUrl(trainer.name, trainer.profileUrl)}
                      alt={trainer.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="from-surface via-surface/20 absolute inset-0 bg-linear-to-t to-transparent" />

                    <span
                      className={`absolute bottom-3 left-3 rounded-lg border px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${spec.badgeClass}`}
                    >
                      {spec.label}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 p-4">
                    <h3 className="text-text-primary truncate text-base font-bold">{trainer.name}</h3>
                    <div className="text-text-muted flex items-center gap-1.5 text-xs font-medium">
                      <Award className="text-secondary h-3.5 w-3.5 shrink-0" />
                      <span>{experienceLabel}</span>
                    </div>
                    {trainer.rate > 0 && (
                      <p className="text-text-secondary mt-1 text-xs font-semibold tabular-nums">
                        Rp {formatRupiah(trainer.rate)} <span className="text-text-muted font-normal">/ session</span>
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
