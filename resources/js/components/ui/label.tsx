import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Label(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof LabelPrimitive.Root>) ***REMOVED***
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className=***REMOVED***cn(
        "text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED*** Label ***REMOVED***
