import { ChevronLeft, ChevronRight } from "lucide-react"
import { type ReactNode } from "react"

import type { PaginationMeta } from "~/types/responses"

export interface TableProps {
  children: ReactNode
  meta?: PaginationMeta["paginate"]
  onPageChange?: (url: string) => void
}

export default function Table({ children, meta, onPageChange }: TableProps) {
  const startData = meta ? (meta.currentPage - 1) * meta.size + 1 : 0
  const endData = meta ? Math.min(meta.currentPage * meta.size, meta.totalData) : 0

  return (
    <div className="mx-auto w-full">
      <div className="w-full overflow-x-auto rounded-md">
        <table className="w-full min-w-max">{children}</table>
      </div>

      {meta && meta.totalData > 0 && (
        <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-text-secondary text-[13px]">
            Menampilkan <span className="font-semibold text-white">{startData}</span> -{" "}
            <span className="font-semibold text-white">{endData}</span> dari{" "}
            <span className="font-semibold text-white">{meta.totalData}</span> data terdaftar
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => meta.prevUrl && onPageChange?.(meta.prevUrl)}
              disabled={!meta.prevUrl}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            {meta.links.slice(1, -1).map((link, index) => {
              const isEllipsis = link.label === "..."

              return (
                <button
                  key={index}
                  onClick={() => !isEllipsis && link.url && onPageChange?.(link.url)}
                  disabled={isEllipsis || link.active}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[13px] font-medium transition-all ${
                    link.active
                      ? "border-primary bg-primary shadow-primary/20 text-white shadow-md"
                      : isEllipsis
                        ? "cursor-default border-transparent text-white/40"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                />
              )
            })}

            <button
              onClick={() => meta.nextUrl && onPageChange?.(meta.nextUrl)}
              disabled={!meta.nextUrl}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
