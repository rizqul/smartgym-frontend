import type { ReactNode } from "react"

export type BadgeVariant = "yellow" | "blue" | "green" | "red" | "orange" | "plain"

export interface BadgeProps {
  icon?: ReactNode
  label: string
  variant?: BadgeVariant
}

export default function Badge({ icon, label, variant = "plain" }: BadgeProps) {
  const baseStyle = "flex w-fit rounded-full px-2 py-1 gap-2 items-center justify-content-center"
  const variants = {
    yellow: "bg-yellow-500/30 text-yellow-200",
    blue: "bg-blue-600/30 text-blue-100",
    green: "bg-green-500/30 text-green-200",
    red: "bg-red-500/30 text-red-200",
    orange: "bg-orange-500/30 text-orange-200",
    plain: "bg-gray-500/30 text-gray-200"
  }

  const finalStyle = [baseStyle, variants[variant]].filter(Boolean).join(" ")
  return (
    <div className={finalStyle}>
      {icon}
      <p className="text-sm">{label}</p>
    </div>
  )
}
