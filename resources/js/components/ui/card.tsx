import * as React from "react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Card(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="card"
      className=***REMOVED***cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CardHeader(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="card-header"
      className=***REMOVED***cn("flex flex-col gap-1.5 px-6", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CardTitle(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="card-title"
      className=***REMOVED***cn("leading-none font-semibold", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CardDescription(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="card-description"
      className=***REMOVED***cn("text-muted-foreground text-sm", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CardContent(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="card-content"
      className=***REMOVED***cn("px-6", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function CardFooter(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"div">) ***REMOVED***
  return (
    <div
      data-slot="card-footer"
      className=***REMOVED***cn("flex items-center px-6", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED*** Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent ***REMOVED***
