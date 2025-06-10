import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function TooltipProvider(***REMOVED***
  delayDuration = 0,
  ...props
***REMOVED***: React.ComponentProps<typeof TooltipPrimitive.Provider>) ***REMOVED***
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration=***REMOVED***delayDuration***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function Tooltip(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof TooltipPrimitive.Root>) ***REMOVED***
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" ***REMOVED***...props***REMOVED*** />
    </TooltipProvider>
  )
***REMOVED***

function TooltipTrigger(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof TooltipPrimitive.Trigger>) ***REMOVED***
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function TooltipContent(***REMOVED***
  className,
  sideOffset = 4,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof TooltipPrimitive.Content>) ***REMOVED***
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset=***REMOVED***sideOffset***REMOVED***
        className=***REMOVED***cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-sm rounded-md px-3 py-1.5 text-xs",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      >
        ***REMOVED***children***REMOVED***
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
***REMOVED***

export ***REMOVED*** Tooltip, TooltipTrigger, TooltipContent, TooltipProvider ***REMOVED***
