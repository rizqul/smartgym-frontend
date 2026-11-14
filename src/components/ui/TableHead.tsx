import { type ReactNode } from "react"

export interface TableHeadProps {
  children: ReactNode
}

export default function TableHead({ children }: TableHeadProps) {
  return <thead className="text-center text-sm whitespace-nowrap">{children}</thead>
}
