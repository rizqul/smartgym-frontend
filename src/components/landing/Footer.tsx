import { Link } from "react-router"
import { Mail, MessageSquareText } from "lucide-react"
import { footerEcosystemMenu } from "~/config/navigation"
import logoGym from "../../assets/logo.png"

export default function LandingFooter() {
  return (
    <footer
      id="kontak"
      className="bg-background border-border/50 border-t"
    >
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_0.85fr_1.25fr]">
          <div className="flex flex-col gap-5">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center text-xl font-black tracking-tighter italic">
                <img
                  src={logoGym}
                  alt="SmartGym Logo"
                  className="h-10 w-10 object-contain drop-shadow-md"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-text-primary text-lg font-extrabold tracking-wide uppercase">
                  SMART<span className="text-primary">GYM</span>
                </span>
              </div>
            </Link>

            <p className="text-text-secondary text-sm leading-relaxed">
              A modern fitness center featuring QR terminal technology, measurable personal coaching, and premium
              fitness facilities.
            </p>

            <div className="bg-surface border-border/60 inline-flex w-fit items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs">
              <span className="bg-success h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-text-secondary font-medium">
                Opening Hours: <strong className="text-primary font-bold">07:00 AM - 09:00 PM WIB</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-text-primary text-base font-bold">Headquarters &amp; Receptionist</h4>
            <div className="text-text-secondary flex flex-col gap-1 text-sm leading-relaxed">
              <span>SmartGym Athletic Complex, Floors 1-3</span>
              <span>Badak Bercula Street 6, No. 88, JKW</span>
              <span>Ujung Kulon, 12190</span>
            </div>

            <div className="mt-1 flex flex-col gap-2.5 text-sm">
              <a
                href="tel:+6281200000000"
                className="text-primary hover:text-primary-hover inline-flex items-center gap-2.5 font-medium transition-colors"
              >
                <MessageSquareText className="h-4 w-4 shrink-0" />
                <span>+62 812-0000-0000</span>
              </a>
              <a
                href="mailto:hello@smartgym.id"
                className="text-text-secondary hover:text-text-primary inline-flex items-center gap-2.5 transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@smartgym.id</span>
              </a>
            </div>
          </div>

          <ul className="flex flex-col gap-2.5 text-sm">
            {footerEcosystemMenu.map((item) => (
              <li key={item.title}>
                {item.to ? (
                  <Link
                    to={item.to}
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    {item.title}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4">
            <h4 className="text-text-primary text-base font-bold">Newsletter &amp; Updates</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              Get self-guided workout tips, weekly fitness class schedules, and exclusive SmartGym updates.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-1 flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-surface border-border/70 text-text-primary placeholder:text-text-muted focus:border-primary w-full min-w-0 flex-1 rounded-xl border px-3.5 py-2.5 text-sm transition-colors outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-background shrink-0 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase shadow-[0_0_16px_rgba(255,107,0,0.35)] transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        <div className="border-border/50 text-text-muted mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs sm:flex-row">
          <span>&copy; 2027 SmartGym Management &amp; Fitness Club. All Rights Reserved.</span>
          <div className="flex items-center gap-6 font-semibold">
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
