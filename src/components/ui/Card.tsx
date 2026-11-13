import * as React from "react"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`w-full rounded-2xl border border-white/4 bg-[#1C1F26] shadow-xl ${className || ""}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 pb-4 sm:p-8 sm:pb-6 ${className || ""}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 sm:p-8 sm:pt-0 ${className || ""}`}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-6 pt-0 sm:p-8 sm:pt-0 ${className || ""}`}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardFooter }
