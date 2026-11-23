import type { ReactNode } from "react"

export interface CardStatsProps {
  topIcon?: ReactNode
  bottomIcon?: ReactNode
  label: string
  value: number | ReactNode
  subLabel?: string
}

export function CardStats({ topIcon, bottomIcon, label, value, subLabel }: CardStatsProps) {
  return (
    <div className="bg-surface hover:bg-surface/80 flex flex-col justify-between gap-4 rounded-2xl px-4 py-4 shadow-sm transition-all">
      <div className="flex flex-row items-start justify-between gap-2">
        <p className="text-text-muted line-clamp-2 text-[12px] leading-snug font-bold uppercase">{label}</p>
        <div className="shrink-0 rounded-lg bg-gray-800 p-1.5 sm:p-2">{topIcon}</div>
      </div>

      <div className="mt-1 flex flex-wrap items-end justify-between gap-x-2 gap-y-2">
        <p className="text-2xl leading-none font-extrabold text-white xl:text-[26px]">
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </p>

        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1">
          <span className="shrink-0 scale-90">{bottomIcon}</span>
          <p className="text-[10px] font-bold whitespace-nowrap text-white">{subLabel}</p>
        </div>
      </div>
    </div>
  )
}
