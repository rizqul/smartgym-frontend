import { useState } from "react"
import {
  Building2,
  CalendarCheck,
  ChevronDown,
  Headset,
  HelpCircle,
  MessageSquareText,
  QrCode,
  ShieldCheck,
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
    question: "Bagaimana cara mendaftar menjadi member baru SmartGym?",
    answer:
      "Pendaftaran dilakukan langsung di meja Front-Desk cabang kami. Staf admin akan membantu verifikasi identitas, aktivasi keanggotaan, serta memberikan akses masuk pertama dan aktivasi akun aplikasi mobile SmartGym.",
    note: "Dilayani di Resepsionis Cabang",
    tag: "Resepsionis",
    icon: Store,
    iconWrapClass: "bg-primary/10 border-primary/20",
    iconClass: "text-primary",
    tagClass: "bg-primary/10 text-primary"
  },
  {
    id: 1,
    question: "Mengapa pendaftaran akun dilakukan melalui admin dan staf, bukan registrasi mandiri?",
    answer:
      "Untuk menjaga keamanan fasilitas 24/7 dan mencegah penyalahgunaan akun, setiap member wajib melewati verifikasi identitas fisik satu kali di resepsionis agar akses QR dan RFID terikat secara resmi.",
    tag: "Keamanan",
    icon: ShieldCheck,
    iconWrapClass: "bg-secondary/10 border-secondary/20",
    iconClass: "text-secondary",
    tagClass: "bg-secondary/10 text-secondary"
  },
  {
    id: 2,
    question: "Bagaimana cara mengakses gate/turnstile jika datang di luar jam staf (tengah malam)?",
    answer:
      "Member dengan paket All-Access Pro atau VIP Elite cukup membuka SmartGym Mobile App dan memindai QR dinamis (atau tap kartu RFID) pada turnstile otomatis di pintu masuk cabang.",
    tag: "Akses 24/7",
    icon: QrCode,
    iconWrapClass: "bg-info/10 border-info/20",
    iconClass: "text-info",
    tagClass: "bg-info/10 text-info"
  },
  {
    id: 3,
    question: "Apakah sesi Personal Trainer (PT) bisa dijadwalkan lewat aplikasi mobile?",
    answer:
      "Ya. Setelah akun aktif, Anda dapat melihat profil coach yang tersedia, mengecek ketersediaan slot secara real-time, dan langsung mengunci jadwal latihan privat 1-on-1 dari aplikasi.",
    tag: "Trainer",
    icon: CalendarCheck,
    iconWrapClass: "bg-primary/10 border-primary/20",
    iconClass: "text-primary",
    tagClass: "bg-primary/10 text-primary"
  },
  {
    id: 4,
    question: "Metode pembayaran apa saja yang diterima di kasir front-desk?",
    answer:
      "Kami menerima pembayaran via QRIS, Virtual Account bank nasional, kartu debit/kredit, serta pembayaran terintegrasi melalui Midtrans Payment Gateway untuk perpanjangan otomatis.",
    tag: "Pembayaran",
    icon: Wallet,
    iconWrapClass: "bg-secondary/10 border-secondary/20",
    iconClass: "text-secondary",
    tagClass: "bg-secondary/10 text-secondary"
  },
  {
    id: 5,
    question: "Apakah membership saya berlaku di seluruh cabang SmartGym?",
    answer:
      "Paket Basic berlaku untuk 1 cabang terdaftar pilihan Anda, sedangkan paket All-Access Pro dan VIP Elite memberikan akses penuh lintas seluruh cabang SmartGym.",
    tag: "Multi-Club",
    icon: Building2,
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
            FAQ RESMI SMARTGYM
          </span>

          <h2 className="text-text-primary mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>

          <p className="text-text-secondary mt-3 text-sm leading-relaxed">
            Segala hal yang perlu Anda ketahui mengenai sistem operasional, pendaftaran akun, dan aplikasi mobile SmartGym.
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

        <div className="bg-surface/80 border-border/60 mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3.5">
            <div className="bg-primary/15 border-primary/25 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border">
              <Headset className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-text-primary text-sm font-bold">Punya Pertanyaan Lain yang Belum Terjawab?</h3>
              <p className="text-text-muted text-xs">Tim customer care &amp; staf front-desk kami siap membantu Anda setiap hari.</p>
            </div>
          </div>

          <a
            href="https://wa.me/6281200000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary-hover text-background inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-colors sm:w-auto"
          >
            <MessageSquareText className="h-4 w-4 shrink-0" />
            <span>Tanya Front-Desk via WA</span>
          </a>
        </div>
      </div>
    </section>
  )
}
