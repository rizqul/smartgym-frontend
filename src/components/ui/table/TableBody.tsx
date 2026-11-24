import { Children, isValidElement, type ReactNode } from "react"
import { TableRowIndexContext, TableSectionContext } from "./context"

export interface TableBody {
  children: ReactNode
  className?: string
}

export default function TableBody({ children, className = "" }: TableBody) {
  return (
    <TableSectionContext.Provider value="body">
      <tbody className={`text-left text-sm ${className}`}>
        {Children.toArray(children).map((child, index) => (
          <TableRowIndexContext.Provider
            key={isValidElement(child) && child.key !== null ? child.key : index}
            value={index}
          >
            {child}
          </TableRowIndexContext.Provider>
        ))}
      </tbody>
    </TableSectionContext.Provider>
  )
}
