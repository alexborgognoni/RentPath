import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import ***REMOVED*** XIcon ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Dialog(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Root>) ***REMOVED***
  return <DialogPrimitive.Root data-slot="dialog" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function DialogTrigger(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Trigger>) ***REMOVED***
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function DialogPortal(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Portal>) ***REMOVED***
  return <DialogPrimitive.Portal data-slot="dialog-portal" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function DialogClose(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Close>) ***REMOVED***
  return <DialogPrimitive.Close data-slot="dialog-close" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function DialogOverlay(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Overlay>) ***REMOVED***
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className=***REMOVED***cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DialogContent(***REMOVED***
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Content>) ***REMOVED***
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className=***REMOVED***cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )***REMOVED***
        ***REMOVED***...props***REMOVED***
      >
        ***REMOVED***children***REMOVED***
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
***REMOVED***

function DialogHeader(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="dialog-header"
      className=***REMOVED***cn("flex flex-col gap-2 text-center sm:text-left", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DialogFooter(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="dialog-footer"
      className=***REMOVED***cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DialogTitle(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Title>) ***REMOVED***
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className=***REMOVED***cn("text-lg leading-none font-semibold", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function DialogDescription(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof DialogPrimitive.Description>) ***REMOVED***
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className=***REMOVED***cn("text-muted-foreground text-sm", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED***
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
***REMOVED***
