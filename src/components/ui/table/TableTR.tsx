import { type ReactNode } from "react"

export interface TableTRProps {
  isEven?: boolean
  isHeader?: boolean
  className?: string
  children: ReactNode
}

export default function TableTR({ children, isEven, isHeader = false, className }: TableTRProps) {
  if (isHeader) {
    return <tr className={`bg-[#282a2e] ${className || ""}`}>{children}</tr>
  }

  if (className) {
    return <tr className={className}>{children}</tr>
  }

  return <tr style={{ backgroundColor: isEven ? "#1A1C20" : "rgba(12, 14, 18, 0.3)" }}>{children}</tr>
}
