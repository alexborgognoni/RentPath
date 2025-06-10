import * as React from "react"
import ***REMOVED*** Slot ***REMOVED*** from "@radix-ui/react-slot"
import ***REMOVED*** ChevronRight, MoreHorizontal ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Breadcrumb(***REMOVED*** ...props ***REMOVED***: React.ComponentProps<"nav">) ***REMOVED***
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function BreadcrumbList(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"ol">) ***REMOVED***
  return (
    <ol
      data-slot="breadcrumb-list"
      className=***REMOVED***cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function BreadcrumbItem(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"li">) ***REMOVED***
  return (
    <li
      data-slot="breadcrumb-item"
      className=***REMOVED***cn("inline-flex items-center gap-1.5", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function BreadcrumbLink(***REMOVED***
  asChild,
  className,
  ...props
***REMOVED***: React.ComponentProps<"a"> & ***REMOVED***
  asChild?: boolean
***REMOVED***) ***REMOVED***
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className=***REMOVED***cn("hover:text-foreground transition-colors", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function BreadcrumbPage(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"span">) ***REMOVED***
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className=***REMOVED***cn("text-foreground font-normal", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function BreadcrumbSeparator(***REMOVED***
  children,
  className,
  ...props
***REMOVED***: React.ComponentProps<"li">) ***REMOVED***
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className=***REMOVED***cn("[&>svg]:size-3.5", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children ?? <ChevronRight />***REMOVED***
    </li>
  )
***REMOVED***

function BreadcrumbEllipsis(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<"span">) ***REMOVED***
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className=***REMOVED***cn("flex size-9 items-center justify-center", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
***REMOVED***

export ***REMOVED***
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
***REMOVED***
