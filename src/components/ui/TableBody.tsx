import { type ReactNode } from "react"

export interface TableBody {
  children: ReactNode
}

export default function TableBody({ children }: TableBody) {
  return <td className="text-left text-sm">{children}</td>
}
