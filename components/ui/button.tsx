import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "glass-strong text-primary-foreground hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-primary to-primary/80",
        destructive:
          "glass-strong text-destructive-foreground hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-destructive to-destructive/80",
        outline:
          "glass border-2 border-border/50 hover:border-primary/50 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "glass text-secondary-foreground hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:glass-subtle hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-12 rounded-2xl px-8",
        icon: "h-10 w-10",
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
