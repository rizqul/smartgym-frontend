import type { ReactNode } from "react"

export interface CardStatsProps {
  topIcon?: ReactNode
  bottomIcon?: ReactNode
  label: string
  value: number
  subLabel?: string
}

export function CardStats({ topIcon, bottomIcon, label, value, subLabel }: CardStatsProps) {
  return (
    <div className="bg-surface flex flex-1 flex-col gap-8 rounded-2xl px-4 py-3">
      <div className="flex flex-row items-center justify-between">
        <p className="text-sm font-bold uppercase">{label}</p>
        <div className="rounded-lg bg-gray-800 p-2">{topIcon}</div>
      </div>

      <div className="flex flex-row items-end justify-between">
        <p className="text-3xl font-extrabold text-white">{value.toLocaleString("en-US")}</p>
        <div className="flex items-center gap-2">
          {bottomIcon}
          <p className="text-sm font-bold text-white">{subLabel}</p>
        </div>
      </div>
    </div>
  )
}
