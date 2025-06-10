import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import ***REMOVED*** type VariantProps ***REMOVED*** from "class-variance-authority"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"
import ***REMOVED*** toggleVariants ***REMOVED*** from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>(***REMOVED***
  size: "default",
  variant: "default",
***REMOVED***)

function ToggleGroup(***REMOVED***
  className,
  variant,
  size,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) ***REMOVED***
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant=***REMOVED***variant***REMOVED***
      data-size=***REMOVED***size***REMOVED***
      className=***REMOVED***cn(
        "group/toggle-group flex items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <ToggleGroupContext.Provider value=***REMOVED******REMOVED*** variant, size ***REMOVED******REMOVED***>
        ***REMOVED***children***REMOVED***
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
***REMOVED***

function ToggleGroupItem(***REMOVED***
  className,
  children,
  variant,
  size,
  ...props
***REMOVED***: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) ***REMOVED***
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant=***REMOVED***context.variant || variant***REMOVED***
      data-size=***REMOVED***context.size || size***REMOVED***
      className=***REMOVED***cn(
        toggleVariants(***REMOVED***
          variant: context.variant || variant,
          size: context.size || size,
    ***REMOVED***),
        "min-w-0 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
    </ToggleGroupPrimitive.Item>
  )
***REMOVED***

export ***REMOVED*** ToggleGroup, ToggleGroupItem ***REMOVED***
