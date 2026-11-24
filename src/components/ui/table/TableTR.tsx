import { useContext, type ReactNode } from "react"
import { TableContext, TableRowIndexContext, TableSectionContext } from "./context"
import TableTH from "./TableTH"
import TableTD from "./TableTD"

export interface TableTRProps {
  isEven?: boolean
  isHeader?: boolean
  hideRowNumber?: boolean
  className?: string
  children: ReactNode
}

export default function TableTR({ children, isEven, isHeader = false, hideRowNumber = false, className }: TableTRProps) {
  const { showRowNumber, startNumber } = useContext(TableContext)
  const section = useContext(TableSectionContext)
  const rowIndex = useContext(TableRowIndexContext)

  const isHeadRow = isHeader || section === "head"
  const shouldRenderNumber = showRowNumber && !hideRowNumber

  const content = (
    <>
      {shouldRenderNumber && isHeadRow && (
        <TableTH className="text-text-muted w-12 text-center text-[11px] font-bold tracking-wider uppercase">NO</TableTH>
      )}
      {shouldRenderNumber && !isHeadRow && rowIndex !== null && (
        <TableTD className="text-text-muted w-12 text-center tabular-nums">{startNumber + rowIndex}</TableTD>
      )}
      {children}
    </>
  )

  if (isHeader) {
    return <tr className={`bg-[#282a2e] ${className || ""}`}>{content}</tr>
  }

  if (className) {
    return <tr className={className}>{content}</tr>
  }

  return <tr style={{ backgroundColor: isEven ? "#1A1C20" : "rgba(12, 14, 18, 0.3)" }}>{content}</tr>
}
