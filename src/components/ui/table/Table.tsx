import { useMemo, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PaginationMeta } from "~/types/common"
import { TableContext } from "./context"

export interface TableProps {
  children: ReactNode
  meta?: PaginationMeta["paginate"]
  onPageChange?: (url: string) => void
  showRowNumber?: boolean
  entityName?: string
}

export default function Table({ children, meta, onPageChange, showRowNumber = true, entityName = "data" }: TableProps) {
  const startData = meta ? (meta.currentPage - 1) * meta.size + 1 : 1
  const endData = meta ? Math.min(meta.currentPage * meta.size, meta.totalData) : 0

  const visibleLinks = useMemo(() => {
    if (!meta || meta.totalPages <= 0) return []

    const { currentPage, totalPages, links = [], nextUrl, prevUrl } = meta

    const getPageUrl = (page: number): string | null => {
      const existing = links.find((l) => Number(l.label) === page && l.url)
      if (existing?.url) return existing.url

      const sampleUrl = links.find((l) => l.url)?.url || nextUrl || prevUrl
      if (!sampleUrl) return null

      try {
        const url = new URL(sampleUrl)
        url.searchParams.set("page", String(page))
        return url.toString()
      } catch {
        return null
      }
    }

    const pages: Array<number | "..."> = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", totalPages)
    } else if (currentPage === 3) {
      pages.push(1, 2, 3, 4, "...", totalPages)
    } else if (currentPage >= totalPages - 1) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
    } else if (currentPage === totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
    }

    return pages.map((item) =>
      item === "..."
        ? { label: "...", url: null, active: false }
        : {
            label: String(item),
            url: getPageUrl(item),
            active: item === currentPage
          }
    )
  }, [meta])

  return (
    <TableContext.Provider value={{ showRowNumber, startNumber: startData }}>
      <div className="mx-auto w-full">
        <div className="custom-scrollbar w-full overflow-x-auto rounded-md">
          <table className="w-full min-w-max">{children}</table>
        </div>

        {meta && meta.totalData > 0 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-4 sm:flex-row">
            <p className="text-text-secondary text-[13px]">
              Menampilkan {startData} - {endData} dari total {meta.totalData} {entityName}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Halaman sebelumnya"
                onClick={() => meta.prevUrl && onPageChange?.(meta.prevUrl)}
                disabled={!meta.prevUrl}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#111318] text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft size={16} />
              </button>

              {visibleLinks.map((link, index) => {
                if (link.label === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-9 min-w-6 items-center justify-center text-sm tracking-widest text-white/45 select-none"
                    >
                      ...
                    </span>
                  )
                }

                return (
                  <button
                    key={`${link.label}-${index}`}
                    type="button"
                    onClick={() => link.url && onPageChange?.(link.url)}
                    disabled={link.active || !link.url}
                    className={`flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg px-2.5 text-[13px] tabular-nums transition-all ${
                      link.active
                        ? "bg-primary cursor-default font-bold text-[#0B0C10]"
                        : "bg-[#111318] font-semibold text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}

              <button
                type="button"
                aria-label="Halaman berikutnya"
                onClick={() => meta.nextUrl && onPageChange?.(meta.nextUrl)}
                disabled={!meta.nextUrl}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#111318] text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </TableContext.Provider>
  )
}
