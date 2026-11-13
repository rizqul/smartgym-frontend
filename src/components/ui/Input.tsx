import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, rightElement, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-text-secondary block text-xs font-medium sm:text-sm">{label}</label>
          {props.name === "password" && (
            <a
              href="#"
              className="text-text-muted hover:text-primary text-xs transition-colors"
            >
              Lupa Sandi?
            </a>
          )}
        </div>

        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Icon
                className="text-text-muted h-5 w-5"
                strokeWidth={1.5}
              />
            </div>
          )}

          <input
            ref={ref}
            className={`bg-background text-text-primary placeholder-text-muted focus:border-primary focus:ring-primary block w-full rounded-lg border py-3 text-sm transition-colors focus:ring-1 focus:outline-none ${Icon ? "pl-11" : "pl-4"} ${rightElement ? "pr-11" : "pr-4"} ${error ? "border-danger focus:border-danger focus:ring-danger" : "border-border"} ${className} `}
            {...props}
          />

          {rightElement && <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">{rightElement}</div>}
        </div>

        {error && <p className="text-danger mt-1 text-xs font-medium">{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"
