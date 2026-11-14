import { type ReactNode } from "react"

export interface TableTRProps {
  isEven: boolean
  isHeader?: boolean
  children: ReactNode
}

export default function TableTR({ children, isEven, isHeader = false }: TableTRProps) {
  return isHeader ? (
    <tr className="bg-[#282a2e]">{children}</tr>
  ) : (
    <tr style={{ backgroundColor: isEven ? "#1A1C20" : "rgba(12, 14, 18, 0.3)" }}>{children}</tr>
  )
}
