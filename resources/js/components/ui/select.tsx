import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import ***REMOVED*** CheckIcon, ChevronDownIcon, ChevronUpIcon ***REMOVED*** from "lucide-react"

import ***REMOVED*** cn ***REMOVED*** from "@/lib/utils"

function Select(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Root>) ***REMOVED***
  return <SelectPrimitive.Root data-slot="select" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SelectGroup(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Group>) ***REMOVED***
  return <SelectPrimitive.Group data-slot="select-group" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SelectValue(***REMOVED***
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Value>) ***REMOVED***
  return <SelectPrimitive.Value data-slot="select-value" ***REMOVED***...props***REMOVED*** />
***REMOVED***

function SelectTrigger(***REMOVED***
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Trigger>) ***REMOVED***
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className=***REMOVED***cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&>span]:line-clamp-1",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      ***REMOVED***children***REMOVED***
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
***REMOVED***

function SelectContent(***REMOVED***
  className,
  children,
  position = "popper",
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Content>) ***REMOVED***
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className=***REMOVED***cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )***REMOVED***
        position=***REMOVED***position***REMOVED***
        ***REMOVED***...props***REMOVED***
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className=***REMOVED***cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )***REMOVED***
        >
          ***REMOVED***children***REMOVED***
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
***REMOVED***

function SelectLabel(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Label>) ***REMOVED***
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className=***REMOVED***cn("px-2 py-1.5 text-sm font-medium", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SelectItem(***REMOVED***
  className,
  children,
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Item>) ***REMOVED***
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className=***REMOVED***cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>***REMOVED***children***REMOVED***</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
***REMOVED***

function SelectSeparator(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.Separator>) ***REMOVED***
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className=***REMOVED***cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)***REMOVED***
      ***REMOVED***...props***REMOVED***
    />
  )
***REMOVED***

function SelectScrollUpButton(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) ***REMOVED***
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className=***REMOVED***cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
***REMOVED***

function SelectScrollDownButton(***REMOVED***
  className,
  ...props
***REMOVED***: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) ***REMOVED***
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className=***REMOVED***cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )***REMOVED***
      ***REMOVED***...props***REMOVED***
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
***REMOVED***

export ***REMOVED***
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
***REMOVED***
