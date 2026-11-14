import { ChevronLeft, ChevronRight } from "lucide-react"
import { type ReactNode } from "react"

export interface TableProps {
  children: ReactNode
}

export default function Table({ children }: TableProps) {
  return (
    <div className="mx-auto w-full overflow-x-auto rounded-md">
      <table className="w-full">{children}</table>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p>Menampilkan 1 - 6 dari 2,845 member terdaftar</p>

        <div className="flex items-center gap-2">
          <span className="bg-primary flex h-5 w-5 items-center rounded-sm">
            <ChevronLeft size={18} />
          </span>

          <span className="bg-primary flex h-5 w-5 items-center rounded-sm">
            <ChevronRight size={18} />
          </span>
        </div>
      </div>
    </div>
  )
}
