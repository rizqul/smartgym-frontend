import { type ReactNode } from "react"

export interface TableTHProps {
  children: ReactNode
}

export default function TableTH({ children }: TableTHProps) {
  return <th className="px-4 py-3">{children}</th>
}
