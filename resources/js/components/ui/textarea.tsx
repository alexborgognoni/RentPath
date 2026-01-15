import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Textarea size scale:
 * - sm: Compact, 3 rows default
 * - md: Default, 4 rows default
 * - lg: Large, 6 rows default
 */
const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      size: {
        sm: "min-h-16 px-3 py-1.5 text-sm",
        md: "min-h-20 px-3 py-2 text-sm",
        lg: "min-h-32 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

function Textarea({
  className,
  size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }