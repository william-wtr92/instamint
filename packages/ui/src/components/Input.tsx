import * as React from "react"

import { cn } from "../lib/utils"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground focus-visible:outline-accent-500 flex h-10 w-full rounded-md border px-3 py-2 text-sm file:bg-transparent file:text-sm file:font-medium focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
