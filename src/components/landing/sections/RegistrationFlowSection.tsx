import { Download, Info, KeyRound, Play, Smartphone, UserCheck } from "lucide-react"

const REGISTRATION_STEPS = [
  {
    step: 1,
    badge: "Di Front-Desk Gym",
    title: "Kunjungi Front-Desk SmartGym",
    desc: "Datang ke flagship club kami (SCBD, BSD, atau PIK 2). Tim resepsionis & staf admin akan memandu pendaftaran, memilih paket membership, dan verifikasi identitas resmi.",
    footerIcon: Info,
    footerLabel: "Pemberkasan & Pembayaran Kasir",
    stepBg: "bg-primary text-background shadow-[0_0_20px_rgba(255,107,0,0.45)]",
    badgeClass: "bg-card/80 text-text-secondary",
    footerClass: "text-primary"
  },
  {
    step: 2,
    badge: "Aktivasi Akun Instan",
    title: "Dapatkan Kredensial Akun",
    desc: "Staf gym langsung menginput profil ke portal admin internal SmartGym. Anda akan menerima link aktivasi akun resmi & nomor member melalui email atau WhatsApp seketika.",
    footerIcon: KeyRound,
    footerLabel: "ID Member Terverifikasi Sistem",
    stepBg: "bg-secondary text-background shadow-[0_0_20px_rgba(255,209,102,0.4)]",
    badgeClass: "bg-card/80 text-secondary",
    footerClass: "text-secondary"
  },
  {
    step: 3,
    badge: "Aplikasi Mobile Member",
    title: "Download SmartGym Mobile App",
    desc: "Login di aplikasi member untuk meng-generate scan QR gate otomatis 24/7, booking jadwal personal trainer, serta memantau grafik InBody dan riwayat latihan.",
    footerIcon: Smartphone,
    footerLabel: "Akses Gate & Booking di Genggaman",
    stepBg: "bg-info text-background shadow-[0_0_20px_rgba(56,189,248,0.4)]",
    badgeClass: "bg-card/80 text-info",
    footerClass: "text-info"
  }
]

export default function RegistrationFlowSection() {
  return (
    <section
      id="alur-pendaftaran"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="bg-surface border-border/70 text-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_24px_rgba(255,107,0,0.15)]">
            <UserCheck className="h-3.5 w-3.5" />
            ALUR REGISTRASI MEMBER
          </span>

          <h2 className="text-text-primary mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">
            3 Langkah Mudah Memulai Latihan
          </h2>

          <p className="text-text-secondary mt-3.5 text-sm leading-relaxed">
            Tanpa registrasi online yang membingungkan. Verifikasi aman dilakukan langsung oleh staf di cabang terdekat, dilanjutkan kendali
            penuh via aplikasi mobile.
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

        <div className="bg-surface/80 border-border/60 mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/15 border-primary/25 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-text-primary text-sm font-bold sm:text-base">Download SmartGym Mobile Member App</h4>
              <p className="text-text-muted text-xs sm:text-[13px]">
                Tersedia di Google Play Store &amp; Apple App Store untuk seluruh member aktif.
              </p>
            </div>
          </div>

          <a
            href="#"
            className="bg-background hover:bg-card border-border text-text-primary inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold transition-colors sm:w-auto"
          >
            <Play className="h-3.5 w-3.5" />
            Google Play
          </a>
        </div>
      </div>
    </section>
  )
}
