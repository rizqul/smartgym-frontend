import { useEffect, useRef, useState } from "react"
import { Calendar, Download, Loader2, X } from "lucide-react"

import { Button } from "~/components/ui/Button"
import { Input } from "~/components/ui/Input"
import { Alert } from "~/utils/alert"
import { exportTransactionsToCsv, type ExportTransactionItem } from "~/utils/exportTransactionsCsv"

interface ExportTransactionPopoverProps {
  currentTransactions: ExportTransactionItem[]
  typeFilter?: string
}

export default function ExportTransactionPopover({ currentTransactions, typeFilter }: ExportTransactionPopoverProps) {
  const today = new Date().toISOString().split("T")[0]
  const firstDayOfMonth = `${today.slice(0, 8)}01`

  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(firstDayOfMonth)
  const [endDate, setEndDate] = useState(today)
  const [isExporting, setIsExporting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleDownloadCsv = async () => {
    if (!startDate || !endDate) {
      Alert.error("Invalid Date", "Please select both start date and end date.")
      return
    }

    if (startDate > endDate) {
      Alert.error("Invalid Date Range", "Start date cannot be later than end date.")
      return
    }

    try {
      setIsExporting(true)

      // TODO: Hubungkan dengan lazy query endpoint export BE jika sudah tersedia:
      // const res = await triggerExport({
      //   startDate,
      //   endDate,
      //   status: "SUCCESS",
      //   type: typeFilter || undefined
      // }).unwrap()
      // const rows = res.data ?? []

      const rows = typeFilter ? currentTransactions.filter((item) => item.type === typeFilter) : currentTransactions

      if (!rows.length) {
        Alert.error("No Data", "No transactions found for the selected date range.")
        return
      }

      exportTransactionsToCsv(rows, startDate, endDate)
      setIsOpen(false)
    } catch {
      Alert.error("Export Failed", "Failed to export transaction data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative self-start sm:self-auto"
    >
      <Button
        type="button"
        variant="primary"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
      >
        <Download className="h-4 w-4" />
        <span>Export CSV</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border border-white/10 bg-[#1C1F26] p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-4 w-4" />
              <span className="text-sm font-bold text-white">Export Date Range</span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close export menu"
              className="text-text-muted cursor-pointer rounded-lg p-1 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-text-muted text-xs font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2 text-[13px] text-white scheme-dark focus:ring-1 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-text-muted text-xs font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                min={startDate || undefined}
                max={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="focus:border-primary focus:ring-primary w-full rounded-xl border border-white/10 bg-[#0B0C10] px-3.5 py-2 text-[13px] text-white scheme-dark focus:ring-1 focus:outline-none"
              />
            </div>

            <Button
              type="button"
              variant="primary"
              disabled={isExporting}
              onClick={handleDownloadCsv}
              className="mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download CSV</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
