import { type ReactNode } from "react"
import { motion } from "motion/react"

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  once?: boolean
  className?: string
}

export default function RevealOnScroll({ children, delay = 0, direction = "up", once = true, className = "" }: RevealOnScrollProps) {
  const offsets = {
    up: { x: 0, y: 64 },
    down: { x: 0, y: -64 },
    left: { x: 64, y: 0 },
    right: { x: -64, y: 0 }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
        filter: "blur(6px)",
        ...offsets[direction]
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        x: 0,
        y: 0
      }}
      viewport={{ once, margin: "-100px" }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
