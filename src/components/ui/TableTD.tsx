import { type ReactNode } from "react"

export interface TableTDProps {
  children: ReactNode
}

export default function TableTD({ children }: TableTDProps) {
  return <td className="px-4 py-3">{children}</td>
}
