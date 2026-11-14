import { type ReactNode } from "react"

export interface TableProps {
  children: ReactNode
}

export default function Table({ children }: TableProps) {
  return (
    <div className="mx-auto w-full overflow-x-auto rounded-md">
      <table className="w-full">{children}</table>
    </div>
  )
}
