import { type ReactNode, type TdHTMLAttributes } from "react"

export interface TableTDProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export default function TableTD({ children, className = "", ...props }: TableTDProps) {
  return (
    <td
      className={`px-4 py-3 ${className}`}
      {...props}
    >
      {children}
    </td>
  )
}
