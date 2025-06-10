import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Avatar(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof AvatarPrimitive.Root>) ***REMOVED***
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className=***REMOVED***cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function AvatarImage(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof AvatarPrimitive.Image>) ***REMOVED***
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className=***REMOVED***cn("aspect-square size-full", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function AvatarFallback(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof AvatarPrimitive.Fallback>) ***REMOVED***
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className=***REMOVED***cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED*** Avatar, AvatarImage, AvatarFallback ***REMOVED***
