import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 350)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-primary hover:bg-primary-hover text-background fixed right-5 bottom-5 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-colors sm:right-7 sm:bottom-7"
        >
          <ArrowUp className="h-5 w-5 stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
