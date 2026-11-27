import { type ReactNode } from "react"
import { TableSectionContext } from "./context"

export interface TableHeadProps {
  children: ReactNode
}

export default function TableHead({ children }: { children: ReactNode }) {
  return (
    <TableSectionContext.Provider value="head">
      <thead className="text-center text-sm whitespace-nowrap">{children}</thead>
    </TableSectionContext.Provider>
  )
}
