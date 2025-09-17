import * as React from "react"
import { clsx } from "clsx"

const badgeVariants = {
  default: "border-transparent bg-blue-600 text-white",
  secondary: "border-transparent bg-gray-100 text-gray-900",
  destructive: "border-transparent bg-red-600 text-white",
  outline: "text-gray-700 border-gray-300",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }