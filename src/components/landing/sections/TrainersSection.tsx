import { useRef } from "react"
import { Award, ChevronLeft, ChevronRight } from "lucide-react"

interface TrainerItem {
  id: string
  name: string
  specialty: string
  specialtyClass: string
  experience: string
  image: string
}

const DUMMY_TRAINERS: TrainerItem[] = [
  {
    id: "1",
    name: "Bagas Pratama, CSCS",
    specialty: "Hypertrophy & Powerlifting",
    specialtyClass: "bg-primary/20 text-primary border-primary/30",
    experience: "8+ Years of Experience",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    name: "Clara Anastasia, ACE-CPT",
    specialty: "Mobility & Fat Loss",
    specialtyClass: "bg-secondary/20 text-secondary border-secondary/30",
    experience: "6+ Years of Experience",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    name: "Rendy Setiawan, NASM-PES",
    specialty: "Athletic Performance",
    specialtyClass: "bg-info/20 text-info border-info/30",
    experience: "7+ Years of Experience",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    name: "Dimas Mahendra, CPT",
    specialty: "Calisthenics & Core",
    specialtyClass: "bg-primary/20 text-primary border-primary/30",
    experience: "5+ Years of Experience",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    name: "Nadia Kusuma, RYT-200",
    specialty: "Functional & Recovery",
    specialtyClass: "bg-secondary/20 text-secondary border-secondary/30",
    experience: "4+ Years of Experience",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
  }
]

export default function TrainersSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

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
        </div>

        <div
          ref={scrollRef}
          className="custom-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4"
        >
          {DUMMY_TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-surface/80 border-border/60 hover:border-border group w-67.5 shrink-0 snap-start overflow-hidden rounded-2xl border transition-colors sm:w-75"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="from-surface via-surface/20 absolute inset-0 bg-linear-to-t to-transparent" />

                <span
                  className={`absolute bottom-3 left-3 rounded-lg border px-2.5 py-1 text-[11px] font-bold backdrop-blur-md ${trainer.specialtyClass}`}
                >
                  {trainer.specialty}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-4">
                <h3 className="text-text-primary truncate text-base font-bold">{trainer.name}</h3>
                <div className="text-text-muted flex items-center gap-1.5 text-xs font-medium">
                  <Award className="text-secondary h-3.5 w-3.5 shrink-0" />
                  <span>{trainer.experience}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
