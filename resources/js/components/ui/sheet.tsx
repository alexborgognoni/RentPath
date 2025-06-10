import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import ***REMOVED*** XIcon ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Sheet(***REMOVED*** ...props ***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Root>) ***REMOVED***
  return <SheetPrimitive.Root data-slot="sheet" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SheetTrigger(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Trigger>) ***REMOVED***
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SheetClose(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Close>) ***REMOVED***
  return <SheetPrimitive.Close data-slot="sheet-close" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SheetPortal(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Portal>) ***REMOVED***
  return <SheetPrimitive.Portal data-slot="sheet-portal" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SheetOverlay(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Overlay>) ***REMOVED***
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className=***REMOVED***cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SheetContent(***REMOVED***
  className,
  children,
  side = "right",
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Content> & ***REMOVED***
  side?: "top" | "right" | "bottom" | "left"
***REMOVED***) ***REMOVED***
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className=***REMOVED***cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      >
        ***REMOVED***children***REMOVED***
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
***REMOVED***

function SheetHeader(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sheet-header"
      className=***REMOVED***cn("flex flex-col gap-1.5 p-4", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SheetFooter(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="sheet-footer"
      className=***REMOVED***cn("mt-auto flex flex-col gap-2 p-4", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SheetTitle(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Title>) ***REMOVED***
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className=***REMOVED***cn("text-foreground font-semibold", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SheetDescription(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SheetPrimitive.Description>) ***REMOVED***
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className=***REMOVED***cn("text-muted-foreground text-sm", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED***
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
***REMOVED***
