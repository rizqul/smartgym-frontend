import { Loader2 } from "lucide-react"
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react"

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost"
export type ButtonSize = "sm" | "md" | "lg" | "icon"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70 disabled:cursor-not-allowed"

    const variants = {
      primary: "bg-primary hover:bg-primary-hover text-white focus:ring-primary shadow-lg shadow-primary/20 border border-transparent",
      secondary: "bg-surface hover:bg-surface/80 text-white border border-border focus:ring-border shadow-sm",
      danger: "bg-danger hover:bg-danger/90 text-white focus:ring-danger shadow-lg shadow-danger/20 border border-transparent",
      outline: "border border-border bg-transparent hover:bg-surface text-text-primary focus:ring-border",
      ghost: "bg-transparent hover:bg-surface text-text-primary focus:ring-border"
    }

    const sizes = {
      sm: "h-9 px-3 text-[13px]",
      md: "h-11 px-4 py-2 text-[14px]",
      lg: "h-12 px-6 text-[15px]",
      icon: "h-10 w-10"
    }

    const buttonClasses = [baseStyles, variants[variant], sizes[size], className].filter(Boolean).join(" ")

    return (
      <button
        ref={ref}
        type={type}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        className={buttonClasses}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2
              className="h-5 w-5 animate-spin text-current"
              aria-hidden="true"
            />
            <span className="sr-only">Memproses...</span>
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
