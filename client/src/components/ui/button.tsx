import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cyber-btn inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-orbitron font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white shadow",
        destructive: "bg-gradient-to-r from-red-600 to-destructive text-destructive-foreground shadow-sm hover:from-destructive hover:to-red-600",
        outline: "border border-primary text-primary hover:bg-primary/10",
        secondary: "bg-gradient-to-r from-secondary to-cyan-500 text-secondary-foreground shadow-sm hover:from-cyan-500 hover:to-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground text-cyan-500",
        link: "text-primary underline-offset-4 hover:underline text-cyan-500",
        glow: "bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-pink-600 text-white shadow shadow-primary/40 hover:shadow-primary/80 transition-shadow",
        cyber: "border border-pink-500 text-pink-500 bg-transparent hover:text-cyan-400 hover:border-cyan-400 transition-colors duration-300"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
