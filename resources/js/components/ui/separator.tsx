import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Separator(***REMOVED***
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
***REMOVED***: React.ComponentProps<typeof SeparatorPrimitive.Root>) ***REMOVED***
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative=***REMOVED***decorative***REMOVED***
      orientation=***REMOVED***orientation***REMOVED***
      className=***REMOVED***cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED*** Separator ***REMOVED***
