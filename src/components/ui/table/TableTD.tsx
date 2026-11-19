import { type ReactNode } from "react"

export interface TableTDProps {
  children: ReactNode
  colSpan?: number
}

export default function TableTD({ children, colSpan }: TableTDProps) {
  return (
    <td
      colSpan={colSpan}
      className="px-4 py-3"
    >
      {children}
    </td>
  )
}
