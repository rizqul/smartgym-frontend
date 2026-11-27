import { createContext } from "react"

export const TableContext = createContext({
  showRowNumber: false,
  startNumber: 1
})

export const TableSectionContext = createContext<"head" | "body" | null>(null)
export const TableRowIndexContext = createContext<number | null>(null)
