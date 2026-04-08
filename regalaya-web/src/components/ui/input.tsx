import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md bg-surface-container-low px-3 py-1 text-sm transition-all border-0 placeholder:text-on-surface-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          error && "ring-2 ring-destructive",
          className
        )}
        style={{
          borderBottom: '1px solid rgba(209, 197, 180, 0.2)',
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
