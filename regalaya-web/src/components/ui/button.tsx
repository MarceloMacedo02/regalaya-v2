import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary text-primary-foreground rounded-full shadow-sm hover:shadow-md transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "bg-surface-container-lowest text-primary shadow-none hover:bg-surface-container-low border-0",
        secondary:
          "bg-surface-container-high text-on-surface-variant shadow-none hover:bg-surface-container-high/80",
        ghost: "hover:bg-surface-container-low text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Admin variants - Confiança Executiva
        adminPrimary:
          "bg-[#1B263B] text-white hover:bg-[#243350] rounded-lg shadow-sm hover:shadow-md transition-all duration-200",
        adminSecondary:
          "bg-[#415A77] text-white hover:bg-[#4d6a8a] rounded-lg shadow-sm hover:shadow-md transition-all duration-200",
        adminOutline:
          "bg-transparent border-2 border-[#1B263B] text-[#1B263B] hover:bg-[#1B263B] hover:text-white rounded-lg transition-all duration-200",
        adminGhost:
          "bg-transparent text-[#415A77] hover:bg-[#E0E1DD] rounded-lg transition-all duration-200",
        adminDanger:
          "bg-[#dc2626] text-white hover:bg-[#b91c1c] rounded-lg shadow-sm transition-all duration-200",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-8",
        icon: "h-10 w-10 rounded-full",
        admin: "h-10 px-4 py-2 rounded-lg",
        adminSm: "h-8 px-3 py-1.5 rounded-md text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
