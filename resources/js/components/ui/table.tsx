import * as React from "react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Table(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"table">) ***REMOVED***
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className=***REMOVED***cn("w-full caption-bottom text-sm", className)***REMOVED***
        ***REMOVED***...props***REMOVED***
      />
    </div>
  )
***REMOVED***

function TableHeader(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"thead">) ***REMOVED***
  return (
    <thead
      data-slot="table-header"
      className=***REMOVED***cn("[&_tr]:border-b", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function TableBody(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"tbody">) ***REMOVED***
  return (
    <tbody
      data-slot="table-body"
      className=***REMOVED***cn("[&_tr:last-child]:border-0", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function TableFooter(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"tfoot">) ***REMOVED***
  return (
    <tfoot
      data-slot="table-footer"
      className=***REMOVED***cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function TableRow(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"tr">) ***REMOVED***
  return (
    <tr
      data-slot="table-row"
      className=***REMOVED***cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function TableHead(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"th">) ***REMOVED***
  return (
    <th
      data-slot="table-head"
      className=***REMOVED***cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function TableCell(***REMOVED*** className, ...props ***REMOVED***: React.ComponentProps<"td">) ***REMOVED***
  return (
    <td
      data-slot="table-cell"
      className=***REMOVED***cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function TableCaption(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<"caption">) ***REMOVED***
  return (
    <caption
      data-slot="table-caption"
      className=***REMOVED***cn("text-muted-foreground mt-4 text-sm", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

export ***REMOVED***
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
***REMOVED***
