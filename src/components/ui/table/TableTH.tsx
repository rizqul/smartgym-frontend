import { type ReactNode, type ThHTMLAttributes } from "react"

export interface TableTHProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode
}

export default function TableTH({ children, className = "", ...props }: TableTHProps) {
  return (
    <th
      className={`px-4 py-3 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}
