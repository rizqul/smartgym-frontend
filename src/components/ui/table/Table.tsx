import { useId, useMemo, type ReactNode } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import type { PaginationMeta } from "~/types/common.type"
import { TableContext } from "./context"

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100]

export interface TableProps {
  children: ReactNode
  meta?: PaginationMeta["paginate"]
  onPageChange?: (url: string) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  pageSizeParamName?: string
  showRowNumber?: boolean
  entityName?: string
}

export default function Table({
  children,
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  pageSizeParamName = "size",
  showRowNumber = true,
  entityName = "items"
}: TableProps) {
  const pageSizeId = useId()

  const currentPage = Number(meta?.currentPage ?? 1)
  const totalPages = Number(meta?.totalPages ?? 0)
  const size = Number(meta?.size ?? 10)
  const totalData = Number(meta?.totalData ?? 0)

  const startData = totalData > 0 ? (currentPage - 1) * size + 1 : 0
  const endData = totalData > 0 ? Math.min(currentPage * size, totalData) : 0

  const buildPageUrl = useMemo(() => {
    const sampleUrl = meta?.links?.find((l) => l.url)?.url || meta?.nextUrl || meta?.prevUrl || ""

    return (page: number, newSize?: number): string => {
      if (!sampleUrl) {
        const params = new URLSearchParams({ page: String(page) })
        if (newSize !== undefined) params.set(pageSizeParamName, String(newSize))
        return `?${params.toString()}`
      }

      if (/^https?:\/\//i.test(sampleUrl)) {
        try {
          const url = new URL(sampleUrl)
          url.searchParams.set("page", String(page))
          if (newSize !== undefined) url.searchParams.set(pageSizeParamName, String(newSize))
          return url.toString()
        } catch {
          const params = new URLSearchParams({ page: String(page) })
          if (newSize !== undefined) params.set(pageSizeParamName, String(newSize))
          return `?${params.toString()}`
        }
      }

      const [path, query = ""] = sampleUrl.split("?")
      const params = new URLSearchParams(query)
      params.set("page", String(page))
      if (newSize !== undefined) params.set(pageSizeParamName, String(newSize))
      return `${path}?${params.toString()}`
    }
  }, [meta?.links, meta?.nextUrl, meta?.prevUrl, pageSizeParamName])

  const visibleLinks = useMemo(() => {
    if (!meta || totalPages <= 0) return []

    const pages: Array<number | "..."> = []

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, "...", currentPage, "...", totalPages)
    }

    return pages.map((item) =>
      item === "..."
        ? { label: "...", page: null, active: false }
        : {
            label: String(item),
            page: item,
            active: item === currentPage
          }
    )
  }, [meta, currentPage, totalPages])

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages
  const canChangePageSize = Boolean(onPageSizeChange || onPageChange)

  const handleGoToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    onPageChange?.(buildPageUrl(page))
  }

  const handlePageSizeChange = (newSize: number) => {
    if (newSize === size) return
    if (onPageSizeChange) {
      onPageSizeChange(newSize)
    } else {
      onPageChange?.(buildPageUrl(1, newSize))
    }
  }

  return (
    <TableContext.Provider value={{ showRowNumber, startNumber: startData || 1 }}>
      <div className="mx-auto w-full">
        <div className="custom-scrollbar w-full overflow-x-auto rounded-md">
          <table className="w-full min-w-max">{children}</table>
        </div>

        {meta && totalData > 0 && (
          <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-4 sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <p className="text-text-secondary text-[13px]">
                Showing <span className="font-medium text-white">{startData}</span> –{" "}
                <span className="font-medium text-white">{endData}</span> of <span className="font-medium text-white">{totalData}</span>{" "}
                {entityName}
              </p>

              {canChangePageSize && (
                <div className="flex items-center gap-2">
                  <span className="hidden h-3.5 w-px bg-white/10 sm:inline-block" />
                  <label
                    htmlFor={pageSizeId}
                    className="text-text-secondary text-[13px]"
                  >
                    Show
                  </label>
                  <div className="relative">
                    <select
                      id={pageSizeId}
                      value={size}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="focus:border-primary h-8 cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#111318] pr-7 pl-2.5 text-[13px] font-medium text-white tabular-nums transition-colors hover:bg-white/10 focus:outline-none"
                    >
                      {pageSizeOptions.map((option) => (
                        <option
                          key={option}
                          value={option}
                          className="bg-[#16181D] text-white"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="text-text-secondary pointer-events-none absolute top-1/2 right-2 -translate-y-1/2"
                    />
                  </div>
                </div>
              )}
            </div>

            <nav
              aria-label="Pagination"
              className="flex items-center gap-1.5"
            >
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => handleGoToPage(currentPage - 1)}
                disabled={!canGoPrev}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#111318] text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft size={16} />
              </button>

              {visibleLinks.map((link, index) => {
                if (link.page === null) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      aria-hidden="true"
                      className="flex h-9 min-w-6 items-center justify-center text-sm tracking-widest text-white/45 select-none"
                    >
                      ...
                    </span>
                  )
                }

                return (
                  <button
                    key={`page-${link.page}`}
                    type="button"
                    aria-label={`Page ${link.label}`}
                    aria-current={link.active ? "page" : undefined}
                    onClick={() => handleGoToPage(link.page)}
                    disabled={link.active}
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
                aria-label="Next page"
                onClick={() => handleGoToPage(currentPage + 1)}
                disabled={!canGoNext}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#111318] text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </TableContext.Provider>
  )
}
