import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: LucideIcon
  error?: string
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, rightElement, className = "", ...props }, ref) => {
    return (
      <div className="flex-1 space-y-2">
        {label && <label className="text-text-muted block text-[11px] font-bold tracking-wider uppercase">{label}</label>}

        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Icon
                className="text-text-muted h-5 w-5"
                strokeWidth={1.5}
              />
            </div>
          )}

          <input
            ref={ref}
            className={`placeholder:text-text-muted focus:border-primary focus:ring-primary block w-full rounded-xl border bg-[#0B0C10] py-3.5 text-[14px] text-white transition-all focus:ring-1 focus:outline-none ${Icon ? "pl-12" : "pl-4"} ${rightElement ? "pr-12" : "pr-4"} ${error ? "border-danger focus:border-danger focus:ring-danger" : "border-white/4"} ${className} `}
            {...props}
          />

          {rightElement && <div className="absolute inset-y-0 right-0 flex items-center pr-4">{rightElement}</div>}
        </div>

        {error && <p className="text-danger mt-1 text-xs font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
