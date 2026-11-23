import RevealOnScroll from "~/components/landing/RevealOnScroll"
import HeroSection from "~/components/landing/sections/HeroSection"
import AboutSection from "~/components/landing/sections/AboutSection"
import RegistrationFlowSection from "~/components/landing/sections/RegistrationFlowSection"
import PackagesSection from "~/components/landing/sections/PackagesSection"
import TrainersSection from "~/components/landing/sections/TrainersSection"
import FaqSection from "~/components/landing/sections/FaqSection"
import CtaSection from "~/components/landing/sections/CtaSection"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />

      <RevealOnScroll>
        <AboutSection />
      </RevealOnScroll>

      <RevealOnScroll>
        <RegistrationFlowSection />
      </RevealOnScroll>

      <RevealOnScroll>
        <PackagesSection />
      </RevealOnScroll>

      <RevealOnScroll>
        <TrainersSection />
      </RevealOnScroll>

      <RevealOnScroll>
        <FaqSection />
      </RevealOnScroll>

      <RevealOnScroll>
        <CtaSection />
      </RevealOnScroll>
    </div>
  )
}
