import type { ReactNode } from "react"

export interface CardStatsProps {
  topIcon?: ReactNode
  bottomIcon?: ReactNode
  label: string
  value: number | ReactNode
  subLabel?: string
}

export function CardStats({ topIcon, bottomIcon, label, value, subLabel }: CardStatsProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString("en-US") : value
  const valueTitle = typeof formattedValue === "string" || typeof formattedValue === "number" ? String(formattedValue) : undefined

  return (
    <div className="bg-surface hover:bg-surface/80 flex h-full min-w-0 flex-col justify-between gap-3 rounded-2xl border border-white/5 px-4 py-4 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <p className="text-text-muted line-clamp-2 text-[12px] leading-snug font-bold tracking-wide uppercase">{label}</p>
        {topIcon && <div className="shrink-0 rounded-lg bg-gray-800 p-1.5 sm:p-2">{topIcon}</div>}
      </div>

      <div className="flex min-w-0 flex-col gap-2.5">
        <p
          title={valueTitle}
          className="truncate text-xl leading-tight font-extrabold tracking-tight text-white tabular-nums sm:text-2xl"
        >
          {formattedValue}
        </p>

        {(subLabel || bottomIcon) && (
          <div className="flex w-fit max-w-full items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
            {bottomIcon && <span className="shrink-0 scale-90">{bottomIcon}</span>}
            {subLabel && <p className="truncate text-[10px] font-bold text-white/90">{subLabel}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
